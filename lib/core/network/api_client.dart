import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../config/app_config.dart';
import '../constants/app_constants.dart';
import '../errors/app_exception.dart';
import '../logging/app_logger.dart';
import '../storage/secure_storage_service.dart';

/// ApiClient: সেন্ট্রাল HTTP ক্লায়েন্ট
///
/// এটি Django REST API-এর সাথে নিরাপদে যোগাযোগ করে।
/// স্বয়ংক্রিয়ভাবে Authorization টোকেন এবং X-Organization-Id হেডার যোগ করে,
/// ফলে মাল্টি-টেন্যান্ট ডেটা আইসোলেশন নিশ্চিত হয়।
class ApiClient {
  final http.Client _httpClient;
  final SecureStorageService _secureStorage;
  final AppConfig _config;

  ApiClient({
    http.Client? httpClient,
    SecureStorageService? secureStorage,
    AppConfig? config,
  })  : _httpClient = httpClient ?? http.Client(),
        _secureStorage = secureStorage ?? SecureStorageService(),
        _config = config ?? AppConfig.instance;

  /// মূল রিকোয়েস্ট এক্সিকিউটর
  Future<dynamic> request({
    required String endpoint,
    required String method,
    Map<String, dynamic>? queryParams,
    dynamic body,
    Map<String, String>? customHeaders,
  }) async {
    final uri = _buildUri(endpoint, queryParams);
    final headers = await _buildHeaders(customHeaders);

    AppLogger.debug('HTTP $method -> $uri');

    try {
      http.Response response;
      final encodedBody = body != null ? jsonEncode(body) : null;

      switch (method.toUpperCase()) {
        case 'GET':
          response = await _httpClient
              .get(uri, headers: headers)
              .timeout(_config.connectTimeout);
          break;
        case 'POST':
          response = await _httpClient
              .post(uri, headers: headers, body: encodedBody)
              .timeout(_config.connectTimeout);
          break;
        case 'PUT':
          response = await _httpClient
              .put(uri, headers: headers, body: encodedBody)
              .timeout(_config.connectTimeout);
          break;
        case 'PATCH':
          response = await _httpClient
              .patch(uri, headers: headers, body: encodedBody)
              .timeout(_config.connectTimeout);
          break;
        case 'DELETE':
          response = await _httpClient
              .delete(uri, headers: headers)
              .timeout(_config.connectTimeout);
          break;
        default:
          throw AppException(
            message: 'Unsupported HTTP method: $method',
          );
      }

      return _handleResponse(response);
    } on SocketException catch (e) {
      AppLogger.error('Network Error: ${e.message}');
      throw const NetworkException();
    } on TimeoutException {
      AppLogger.error('Request Timeout on $endpoint');
      throw const TimeoutException();
    } on AppException {
      rethrow;
    } catch (e, stack) {
      AppLogger.error('Unexpected HTTP Error: $e', stack);
      throw AppException(
        message: 'অপ্রত্যাশিত নেটওয়ার্ক ত্রুটি দেখা দিয়েছে।',
        technicalDetails: e.toString(),
      );
    }
  }

  /// GET রিকোয়েস্ট
  Future<dynamic> get(String endpoint, {Map<String, dynamic>? queryParams, Map<String, String>? headers}) {
    return request(endpoint: endpoint, method: 'GET', queryParams: queryParams, customHeaders: headers);
  }

  /// POST রিকোয়েস্ট
  Future<dynamic> post(String endpoint, {dynamic body, Map<String, String>? headers}) {
    return request(endpoint: endpoint, method: 'POST', body: body, customHeaders: headers);
  }

  /// PUT রিকোয়েস্ট
  Future<dynamic> put(String endpoint, {dynamic body, Map<String, String>? headers}) {
    return request(endpoint: endpoint, method: 'PUT', body: body, customHeaders: headers);
  }

  /// PATCH রিকোয়েস্ট
  Future<dynamic> patch(String endpoint, {dynamic body, Map<String, String>? headers}) {
    return request(endpoint: endpoint, method: 'PATCH', body: body, customHeaders: headers);
  }

  /// DELETE রিকোয়েস্ট
  Future<dynamic> delete(String endpoint, {Map<String, String>? headers}) {
    return request(endpoint: endpoint, method: 'DELETE', customHeaders: headers);
  }

  /// URI বিল্ডার
  Uri _buildUri(String endpoint, Map<String, dynamic>? queryParams) {
    final cleanBase = _config.apiBaseUrl.endsWith('/')
        ? _config.apiBaseUrl.substring(0, _config.apiBaseUrl.length - 1)
        : _config.apiBaseUrl;
    final cleanEndpoint = endpoint.startsWith('/') ? endpoint : '/$endpoint';
    final fullUrl = '$cleanBase$cleanEndpoint';

    final uri = Uri.parse(fullUrl);
    if (queryParams != null && queryParams.isNotEmpty) {
      return uri.replace(queryParameters: queryParams.map((k, v) => MapEntry(k, v.toString())));
    }
    return uri;
  }

  /// Headers বিল্ডার: Authentication এবং Organization Context ইনজেক্ট করা হয়
  Future<Map<String, String>> _buildHeaders(Map<String, String>? customHeaders) async {
    final headers = <String, String>{
      AppConstants.headerContentType: AppConstants.contentTypeJson,
      AppConstants.headerAccept: AppConstants.contentTypeJson,
    };

    // ১. Authentication Token (যদি সংরক্ষিত থাকে)
    final token = await _secureStorage.getAuthToken();
    if (token != null && token.isNotEmpty) {
      headers[AppConstants.headerAuthorization] = 'Bearer $token';
    }

    // ২. Organization Context (প্রতিটি ব্যবসায়িক ডেটার আইসোলেশনের জন্য অত্যাবশ্যক)
    final orgId = await _secureStorage.getCurrentOrganizationId();
    if (orgId != null && orgId.isNotEmpty) {
      headers[AppConstants.headerOrganizationId] = orgId;
    }

    if (customHeaders != null) {
      headers.addAll(customHeaders);
    }

    return headers;
  }

  /// সার্ভার রেসপন্স হ্যান্ডলার
  dynamic _handleResponse(http.Response response) {
    AppLogger.debug('HTTP ${response.statusCode} <- ${response.request?.url}');

    final statusCode = response.statusCode;
    dynamic responseData;

    try {
      if (response.body.isNotEmpty) {
        responseData = jsonDecode(utf8.decode(response.bodyBytes));
      }
    } catch (_) {
      responseData = response.body;
    }

    if (statusCode >= 200 && statusCode < 300) {
      return responseData;
    }

    // এরর কোড অনুসারে এক্সেপশন থ্রো করা
    switch (statusCode) {
      case 401:
        throw UnauthorizedException(
          message: _extractErrorMessage(responseData) ?? 'লগইন সেশন মেয়াদোত্তীর্ণ হয়েছে।',
          statusCode: 401,
        );
      case 403:
        throw ForbiddenException(
          message: _extractErrorMessage(responseData) ?? 'এই কার্যক্রমে আপনার অনুমতি নেই।',
          statusCode: 403,
        );
      case 404:
        throw NotFoundException(
          message: _extractErrorMessage(responseData) ?? 'অনুরোধকৃত তথ্যটি পাওয়া যায়নি।',
          statusCode: 404,
        );
      case 400:
      case 422:
        throw ValidationException(
          message: _extractErrorMessage(responseData) ?? 'প্রদত্ত তথ্যে কিছু ভুল রয়েছে।',
          errors: responseData is Map<String, dynamic> ? responseData : null,
          statusCode: statusCode,
        );
      case 500:
      case 502:
      case 503:
        throw ServerException(
          message: 'সার্ভারে সাময়িক ত্রুটি। অনুগ্রহ করে কিছুক্ষণ পর চেষ্টা করুন।',
          statusCode: statusCode,
        );
      default:
        throw AppException(
          message: _extractErrorMessage(responseData) ?? 'সার্ভার থেকে ত্রুটি সংকেত ($statusCode) এসেছে।',
          statusCode: statusCode,
        );
    }
  }

  String? _extractErrorMessage(dynamic data) {
    if (data is Map<String, dynamic>) {
      if (data.containsKey('detail')) return data['detail'].toString();
      if (data.containsKey('message')) return data['message'].toString();
      if (data.containsKey('error')) return data['error'].toString();
    }
    return null;
  }
}

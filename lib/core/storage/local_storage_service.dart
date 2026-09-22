import 'package:shared_preferences/shared_preferences.dart';
import '../logging/app_logger.dart';

/// LocalStorageService: সাধারণ কি-ভ্যালু ও প্রেফারেন্স স্টোরেজ
///
/// ব্যবহারকারীর সেটিংস, থিম অপশন বা সাধারণ নন-সিক্রেট সেটিংস
/// রাখার জন্য SharedPreferences ব্যবহার করে।
/// (আর্কিটেকচার রুল: কোনো গুরুত্বপূর্ণ আর্থিক বা ব্যবসায়িক রেকর্ড
/// এখানে স্থায়ীভাবে রাখা যাবে না।)
class LocalStorageService {
  SharedPreferences? _prefs;

  Future<SharedPreferences> get _instance async {
    _prefs ??= await SharedPreferences.getInstance();
    return _prefs!;
  }

  Future<bool> setString(String key, String value) async {
    try {
      final p = await _instance;
      return await p.setString(key, value);
    } catch (e) {
      AppLogger.error('LocalStorage write error for key: $key', e);
      return false;
    }
  }

  Future<String?> getString(String key) async {
    try {
      final p = await _instance;
      return p.getString(key);
    } catch (e) {
      AppLogger.error('LocalStorage read error for key: $key', e);
      return null;
    }
  }

  Future<bool> setBool(String key, bool value) async {
    try {
      final p = await _instance;
      return await p.setBool(key, value);
    } catch (e) {
      AppLogger.error('LocalStorage write error for key: $key', e);
      return false;
    }
  }

  Future<bool?> getBool(String key) async {
    try {
      final p = await _instance;
      return p.getBool(key);
    } catch (e) {
      AppLogger.error('LocalStorage read error for key: $key', e);
      return null;
    }
  }

  Future<bool> remove(String key) async {
    try {
      final p = await _instance;
      return await p.remove(key);
    } catch (e) {
      AppLogger.error('LocalStorage remove error for key: $key', e);
      return false;
    }
  }
}

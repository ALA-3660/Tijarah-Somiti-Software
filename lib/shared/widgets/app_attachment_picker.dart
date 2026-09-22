import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_spacing.dart';
import '../../app/theme/app_radius.dart';

/// AppAttachmentItem: সংযুক্ত ফাইলের ডেটা মডেল
class AppAttachmentItem {
  final String id;
  final String name;
  final String? sizeString;
  final String? previewUrl;
  final bool isUploading;
  final double? uploadProgress;
  final String? error;

  const AppAttachmentItem({
    required this.id,
    required this.name,
    this.sizeString,
    this.previewUrl,
    this.isUploading = false,
    this.uploadProgress,
    this.error,
  });
}

/// AppAttachmentPicker: তিজারাহ সমিতি সফটওয়্যারের সেন্ট্রালাইজড ফাইল/ডকুমেন্ট পিকিং উইজেট
class AppAttachmentPicker extends StatelessWidget {
  final String? label;
  final String helperText;
  final List<AppAttachmentItem> attachments;
  final VoidCallback onPickFile;
  final VoidCallback? onTakePhoto;
  final ValueChanged<AppAttachmentItem> onRemove;
  final int maxFiles;
  final bool isRequired;
  final bool isEnabled;

  const AppAttachmentPicker({
    super.key,
    this.label = 'সংযুক্ত ফাইল / দলিল (Attachments)',
    this.helperText = 'পিডিএফ, ছবি বা স্ক্যান কপি আপলোড করুন (সর্বোচ্চ ৫ মেগাবাইট)',
    required this.attachments,
    required this.onPickFile,
    this.onTakePhoto,
    required this.onRemove,
    this.maxFiles = 5,
    this.isRequired = false,
    this.isEnabled = true,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (label != null) ...[
          Row(
            children: [
              Text(
                label!,
                style: const TextStyle(
                  fontFamily: AppTypography.fontHeading,
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
              if (isRequired)
                const Text(' *', style: TextStyle(color: AppColors.error, fontWeight: FontWeight.bold, fontSize: 14)),
            ],
          ),
          const SizedBox(height: 2),
          Text(
            helperText,
            style: const TextStyle(
              fontFamily: AppTypography.fontBody,
              fontSize: 11,
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
        ],

        // Upload action box
        if (attachments.length < maxFiles && isEnabled)
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(AppSpacing.md),
            decoration: BoxDecoration(
              color: AppColors.neutral50,
              borderRadius: AppRadius.radiusMd,
              border: Border.all(
                color: AppColors.borderLight,
                style: BorderStyle.solid,
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                OutlinedButton.icon(
                  onPressed: onPickFile,
                  icon: const Icon(Icons.upload_file, size: 18, color: AppColors.primary),
                  label: const Text(
                    'ফাইল নির্বাচন করুন',
                    style: TextStyle(fontFamily: AppTypography.fontNumeric, fontSize: 12),
                  ),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppColors.primary,
                    side: const BorderSide(color: AppColors.primary),
                    shape: AppRadius.shapeMd(),
                  ),
                ),
                if (onTakePhoto != null) ...[
                  const SizedBox(width: AppSpacing.sm),
                  OutlinedButton.icon(
                    onPressed: onTakePhoto,
                    icon: const Icon(Icons.camera_alt_outlined, size: 18, color: AppColors.secondary),
                    label: const Text(
                      'ছবি তুলুন',
                      style: TextStyle(fontFamily: AppTypography.fontNumeric, fontSize: 12),
                    ),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.secondary,
                      side: const BorderSide(color: AppColors.secondary),
                      shape: AppRadius.shapeMd(),
                    ),
                  ),
                ],
              ],
            ),
          ),

        // List of attached items
        if (attachments.isNotEmpty) ...[
          const SizedBox(height: AppSpacing.sm),
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: attachments.length,
            separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.xs),
            itemBuilder: (context, index) {
              final item = attachments[index];
              return Container(
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.sm),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: AppRadius.radiusMd,
                  border: Border.all(color: item.error != null ? AppColors.error : AppColors.borderLight),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.insert_drive_file_outlined, size: 22, color: AppColors.primary),
                    const SizedBox(width: AppSpacing.sm),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            item.name,
                            style: const TextStyle(
                              fontFamily: AppTypography.fontBody,
                              fontSize: 13,
                              fontWeight: FontWeight.w500,
                              color: AppColors.textPrimary,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          if (item.isUploading) ...[
                            const SizedBox(height: 4),
                            LinearProgressIndicator(
                              value: item.uploadProgress,
                              backgroundColor: AppColors.neutral200,
                              valueColor: const AlwaysStoppedAnimation<Color>(AppColors.primary),
                              minHeight: 3,
                            ),
                          ] else if (item.sizeString != null) ...[
                            Text(
                              item.sizeString!,
                              style: const TextStyle(
                                fontFamily: AppTypography.fontNumeric,
                                fontSize: 11,
                                color: AppColors.textSecondary,
                              ),
                            ),
                          ],
                          if (item.error != null)
                            Text(
                              item.error!,
                              style: const TextStyle(
                                fontFamily: AppTypography.fontBody,
                                fontSize: 11,
                                color: AppColors.error,
                              ),
                            ),
                        ],
                      ),
                    ),
                    if (isEnabled)
                      IconButton(
                        icon: const Icon(Icons.delete_outline, size: 18, color: AppColors.error),
                        onPressed: () => onRemove(item),
                        tooltip: 'ফাইলটি মুছে ফেলুন',
                      ),
                  ],
                ),
              );
            },
          ),
        ],
      ],
    );
  }
}

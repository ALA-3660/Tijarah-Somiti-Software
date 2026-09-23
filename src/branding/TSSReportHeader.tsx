import React from 'react';
import { TSSLogo } from './TSSLogo';
import { BRAND_CONFIG } from './brandingConfig';
import { OrganizationContext } from '../types';

export interface TSSReportHeaderProps {
  organization: OrganizationContext;
  reportTitle: string;
  reportSubtitle?: string;
  reportCode?: string;
  dateRange?: string;
  generatedBy?: string;
  className?: string;
}

export const TSSReportHeader: React.FC<TSSReportHeaderProps> = ({
  organization,
  reportTitle,
  reportSubtitle,
  reportCode,
  dateRange,
  generatedBy = 'সিস্টেম অ্যাডমিনিস্ট্রেটর',
  className = '',
}) => {
  return (
    <div className={`p-6 bg-white border border-slate-200 rounded-xl space-y-4 print:border-none print:p-0 ${className}`}>
      {/* Top Banner: TSS Software Branding Header (Header Rule: Software Brand -> Organization -> Document Title) */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <TSSLogo variant="compact" theme="light" size="sm" showBangla={true} />
        <div className="text-right text-[11px] text-slate-500 font-mono">
          <span>{BRAND_CONFIG.shortName} Report Engine</span>
          {reportCode && <span className="ml-2 px-1.5 py-0.5 bg-slate-100 rounded text-slate-700 font-bold">{reportCode}</span>}
        </div>
      </div>

      {/* Organization / Society Title Area */}
      <div className="text-center space-y-1 pt-1">
        <div className="inline-flex items-center gap-2 justify-center">
          <h2 className="text-lg font-bold text-slate-900 font-heading">
            {organization.name}
          </h2>
          {organization.isDemo && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 font-mono">
              DEMO / SAMPLE
            </span>
          )}
        </div>
        {organization.address && (
          <p className="text-xs text-slate-500 font-body">
            ঠিকানা: {organization.address} {organization.phone ? `| ফোন: ${organization.phone}` : ''}
          </p>
        )}
      </div>

      {/* Document / Report Title */}
      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 text-center space-y-0.5">
        <h3 className="text-base font-bold text-slate-800 font-heading">
          {reportTitle}
        </h3>
        {reportSubtitle && (
          <p className="text-xs text-slate-600 font-body">
            {reportSubtitle}
          </p>
        )}
        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 font-numeric pt-1">
          {dateRange && <span>তারিখ/মেয়াদ: <strong>{dateRange}</strong></span>}
          <span>প্রস্তুতকারী: <strong>{generatedBy}</strong></span>
          <span>প্রিন্ট সময়: <strong>{new Date().toLocaleString('bn-BD')}</strong></span>
        </div>
      </div>
    </div>
  );
};

export const TSSReportFooter: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  return (
    <div className={`mt-6 pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-body ${className}`}>
      <div className="flex items-center gap-1.5">
        <span>Powered by</span>
        <strong className="text-slate-800 font-mono">{BRAND_CONFIG.shortName}</strong>
        <span>— {BRAND_CONFIG.fullName} ({BRAND_CONFIG.banglaName})</span>
      </div>
      <div className="text-[10px] font-mono text-slate-400 mt-1 sm:mt-0">
        {BRAND_CONFIG.copyright}
      </div>
    </div>
  );
};

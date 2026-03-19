const fs = require('fs');
let content = fs.readFileSync('components/AssessmentForm.tsx', 'utf8');

content = content.replace(/#E11D48/g, '#2563EB'); 
content = content.replace(/#F43F5E/g, '#3B82F6'); 
content = content.replace(/#BE123C/g, '#1D4ED8'); 
content = content.replace(/#FDA4AF/g, '#93C5FD'); 
content = content.replace(/#FECDD3/g, '#BFDBFE'); 
content = content.replace(/#FFF1F2/g, '#EFF6FF'); 
content = content.replace(/rgba\(225,29,72,/g, 'rgba(37,99,235,'); 

content = content.replace(/rose-600/g, 'blue-600');
content = content.replace(/rose-500/g, 'blue-500');
content = content.replace(/rose-400/g, 'blue-500');
content = content.replace(/rose-300/g, 'blue-400');
content = content.replace(/rose-200/g, 'blue-200');
content = content.replace(/rose-100/g, 'blue-100');
content = content.replace(/rose-50/g, 'blue-50');

const headerP = `<header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-blue-100">
        <div className="max-w-3xl mx-auto px-5 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #2563EB, #3B82F6)' }}>
              <span className="text-white font-black text-sm">A</span>
            </div>
            <div>
              <p className="font-bold text-sm leading-none" style={{ color: '#0F172A' }}>Aster Homecare</p>
              <p className="text-blue-500 text-[10px] leading-none mt-0.5 uppercase tracking-wide">UK Ltd</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-xs text-gray-400">CQC Registered</span>
            </div>
            <span className="text-xs font-semibold text-gray-400">Step {step + 1} of {STEPS.length}</span>
          </div>
        </div>`;

const newHeader = `<header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-blue-100">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors text-sm font-semibold flex items-center gap-1.5">
            <ArrowLeft className="w-4 h-4" /> Cancel
          </Link>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">Step {step + 1} of {STEPS.length}</span>
        </div>`;

content = content.replace(headerP, newHeader);
content = content.replace(/linear-gradient\(90deg, #2563EB, #F97316, #F59E0B\)/g, 'linear-gradient(90deg, #93C5FD, #2563EB)');

fs.writeFileSync('components/AssessmentForm.tsx', content);

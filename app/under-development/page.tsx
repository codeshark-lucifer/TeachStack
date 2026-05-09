import Link from "next/link";
import { Topbar } from "@/components/topbar";
import { ArrowLeft, Construction } from "lucide-react";

export default function UnderDevelopment() {
  return (
    <>
      <Topbar />
      
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-surface border border-line rounded-brand">
        <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-6">
          <Construction size={48} />
        </div>
        
        <h1 className="text-2xl font-bold text-ink mb-4">កំពុងអភិវឌ្ឍ</h1>
        <p className="text-muted max-w-[400px] mb-8 leading-relaxed">
          សូមអភ័យទោស! ផ្នែកនេះកំពុងស្ថិតក្នុងការអភិវឌ្ឍនៅឡើយ។ យើងខ្ញុំនឹងដាក់ឱ្យដំណើរការក្នុងពេលឆាប់ៗនេះ។
        </p>
        
        <Link 
          href="/"
          className="secondary-action w-full max-w-[200px]"
        >
          <ArrowLeft size={20} />
          ត្រឡប់ក្រោយ
        </Link>
      </div>
    </>
  );
}

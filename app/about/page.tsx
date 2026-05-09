import Link from "next/link";
import { Topbar } from "@/components/topbar";
import { ArrowLeft, Info, Heart, Users, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <Topbar />
      
      <div className="max-w-[600px] mx-auto p-4 animate-enter">
        <Link
          href="/"
          className="flex items-center gap-2 text-primary font-bold mb-8 hover:opacity-80 transition-all w-fit"
        >
          <ArrowLeft size={20} />
          ត្រឡប់ក្រោយ
        </Link>

        <section className="bg-surface border border-line rounded-brand p-8 mb-6 shadow-sm">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Info size={40} />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center text-ink mb-6">អំពី TeachStack</h1>
          <p className="text-muted leading-relaxed mb-6 text-center">
            TeachStack គឺជាវេទិកាសាកល្បងចំណេះដឹងតាមអនឡាញ ដែលត្រូវបានបង្កើតឡើងក្នុងគោលបំណងជួយសម្រួលដល់ប្អូនៗសិស្សានុសិស្ស និងសាធារណជនទូទៅ ក្នុងការត្រៀមខ្លួនសម្រាប់វិញ្ញាសាប្រឡងចូលក្របខណ្ឌរដ្ឋ និងស្ថាប័ននានា។
          </p>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                <Heart size={24} />
              </div>
              <div>
                <h3 className="font-bold text-ink mb-1">បេសកកម្មរបស់យើង</h3>
                <p className="text-muted text-sm leading-relaxed">
                  ផ្តល់ជូននូវប្រភពឯកសារ និងវិញ្ញាសាដែលមានគុណភាព ងាយស្រួលចូលប្រើប្រាស់ និងមានប្រសិទ្ធភាពខ្ពស់។
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 shrink-0">
                <Users size={24} />
              </div>
              <div>
                <h3 className="font-bold text-ink mb-1">ក្រុមការងារ</h3>
                <p className="text-muted text-sm leading-relaxed">
                  យើងខ្ញុំជាក្រុមនិស្សិតដែលស្រលាញ់ការអប់រំ និងបច្ចេកវិទ្យា ចង់រួមចំណែកក្នុងការកសាងសមត្ថភាពធនធានមនុស្សនៅកម្ពុជា។
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-bold text-ink mb-1">ទំនុកចិត្ត</h3>
                <p className="text-muted text-sm leading-relaxed">
                  វិញ្ញាសាទាំងអស់ត្រូវបានចម្រាញ់ចេញពីប្រភពផ្លូវការ និងបទពិសោធន៍ជាក់ស្តែងនៃការប្រឡងនាពេលកន្លងមក។
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="text-center py-6">
          <p className="text-muted text-xs">© 2026 TeachStack Project. រក្សាសិទ្ធិគ្រប់យ៉ាង។</p>
        </div>
      </div>
    </>
  );
}

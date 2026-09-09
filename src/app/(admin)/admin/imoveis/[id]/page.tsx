import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAdminProperty } from "@/lib/admin";
import { PropertyEditor } from "@/components/admin/PropertyEditor";

export const dynamic = "force-dynamic";

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const creating = id === "novo";

  const initial = creating ? null : await getAdminProperty(id);
  if (!creating && !initial) notFound();

  return (
    <>
      <Link
        href="/admin"
        className="text-smoke hover:text-gold mb-8 inline-flex items-center gap-2.5 font-mono text-[10px] tracking-[0.2em] uppercase transition-colors duration-400"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
        Todos os imóveis
      </Link>

      <PropertyEditor initial={initial} id={creating ? null : id} />
    </>
  );
}

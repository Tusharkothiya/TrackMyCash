import { redirect } from "next/navigation";

export default async function TransactionDetailPage() {
  redirect("/transactions");
}

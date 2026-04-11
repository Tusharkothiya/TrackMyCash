"use client";

import { useState, useMemo } from "react";
import { Plus, Wallet as WalletIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AccountCard } from "./components/AccountCard";
import AddAccountModal from "./components/AddAccountModal";
import {
  useAccounts,
  useCreateAccount,
  useUpdateAccount,
  useDeleteAccount,
} from "@/hooks/useAccounts";
import { Account, AccountPayload } from "./types";
import { ConfirmActionModal } from "@/components/ui/ConfirmActionModal";

const ACCOUNT_SKELETON_COUNT = 2;

function AccountCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-outline-variant/10 bg-surface-container p-8 h-full">
      <div className="pointer-events-none absolute inset-0 animate-pulse bg-linear-to-r from-transparent via-white/5 to-transparent" />

      <div className="relative flex items-start gap-5 mb-8">
        <div className="h-14 w-14 rounded-2xl bg-surface-bright animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-6 w-40 rounded-lg bg-surface-bright animate-pulse" />
          <div className="h-7 w-24 rounded-full bg-surface-bright animate-pulse" />
        </div>
      </div>

      <div className="relative space-y-3">
        <div className="h-3 w-32 rounded-lg bg-surface-bright animate-pulse" />
        <div className="h-9 w-48 rounded-lg bg-surface-bright animate-pulse" />
        <div className="h-3 w-20 rounded-lg bg-surface-bright/80 animate-pulse" />
      </div>
    </div>
  );
}

const Accounts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [deleteAccountId, setDeleteAccountId] = useState<string | null>(null);
  const [modalApiMessage, setModalApiMessage] = useState<string | null>(null);
  const [deleteApiMessage, setDeleteApiMessage] = useState<string | null>(null);

  const createAccountMutation = useCreateAccount();
  const updateAccountMutation = useUpdateAccount();
  const deleteAccountMutation = useDeleteAccount();

  const accountsQuery = useAccounts();

  const accounts: Account[] = useMemo(() => {
    if (!accountsQuery.data?.success || !Array.isArray(accountsQuery.data?.data)) {
      return [];
    }
    return accountsQuery.data.data;
  }, [accountsQuery.data]);

  const selectedAccount = useMemo(() => {
    return editingAccount;
  }, [editingAccount]);

  const isSubmitting = createAccountMutation.isPending || updateAccountMutation.isPending;

  const deleteAccountData = useMemo(
    () => accounts.find((account) => account._id === deleteAccountId) || null,
    [accounts, deleteAccountId]
  );

  const totalBalance = accounts.reduce((acc, curr) => {
    if (curr.type === "Credit Card") return acc - curr.balance;
    return acc + curr.balance;
  }, 0);

  const handleModalOpenForCreate = () => {
    setModalApiMessage(null);
    setEditingAccount(null);
    setIsModalOpen(true);
  };

  const handleModalOpenForEdit = (account: Account) => {
    setModalApiMessage(null);
    setEditingAccount(account);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setModalApiMessage(null);
    setIsModalOpen(false);
    setEditingAccount(null);
  };

  const handleAccountSave = async (payload: AccountPayload) => {
    setModalApiMessage(null);

    if (editingAccount) {
      const result = await updateAccountMutation.mutateAsync({
        accountId: editingAccount._id,
        payload,
      });

      if (!result?.success) {
        setModalApiMessage(result?.message || "Unable to update account.");
        return;
      }

      handleModalClose();
      return;
    }

    const result = await createAccountMutation.mutateAsync(payload);
    if (!result?.success) {
      setModalApiMessage(result?.message || "Unable to create account.");
      return;
    }

    handleModalClose();
  };

  const handleDeletePromptOpen = (id: string) => {
    setDeleteApiMessage(null);
    setDeleteAccountId(id);
  };

  const handleDeletePromptClose = () => {
    if (deleteAccountMutation.isPending) return;
    setDeleteApiMessage(null);
    setDeleteAccountId(null);
  };

  const handleDeleteAccount = async () => {
    if (!deleteAccountId) return;

    const result = await deleteAccountMutation.mutateAsync(deleteAccountId);
    if (!result?.success) {
      setDeleteApiMessage(result?.message || "Unable to delete account.");
      return;
    }

    handleDeletePromptClose();
  };

  return (
    <div>
      <main className="min-h-screen relative overflow-hidden flex flex-col max-w-7xl mx-auto">
        {/* Background Decoration */}
        <div className="fixed top-0 right-0 -z-10 w-150 h-150 bg-primary/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="fixed bottom-0 left-65 -z-10 w-100 h-100 bg-tertiary/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />

        {/* Action Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-1 block">
              Global Overview
            </span>
            <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">
              Financial Assets
            </h2>
          </div>
          <button
            onClick={handleModalOpenForCreate}
            className="bg-linear-to-br cursor-pointer from-primary-container to-primary text-on-primary-fixed px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-primary-container/20"
          >
            <Plus size={20} />
            Add Account
          </button>
        </div>

        {/* Summary Bar */}
        {!accountsQuery.isLoading && (
          <section className="mb-10 p-8 rounded-xl bg-surface-container-low flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="p-4 rounded-full bg-primary-container/10 text-primary">
                <WalletIcon size={32} />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-widest text-on-surface-variant font-bold">
                  Total Combined Balance
                </span>
                <div className="text-3xl font-black text-on-surface mt-1">
                  ₹
                  {totalBalance.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Account Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {accountsQuery.isLoading ? (
            <>
              {Array.from({ length: ACCOUNT_SKELETON_COUNT }).map((_, index) => (
                <AccountCardSkeleton key={`account-skeleton-${index}`} />
              ))}
            </>
          ) : (
            <>
              <AnimatePresence mode="popLayout">
                {accounts.map((account) => (
                  <motion.div
                    key={account._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -4 }}
                  >
                    <AccountCard
                      account={account}
                      onEdit={handleModalOpenForEdit}
                      onDelete={handleDeletePromptOpen}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {!accountsQuery.isLoading && accounts.length === 0 && (
                <div className="col-span-full bg-surface-container rounded-2xl p-10 text-center text-on-surface-variant font-medium">
                  No accounts found. Create one to get started.
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <AddAccountModal
        isOpen={isModalOpen}
        mode={editingAccount ? "edit" : "create"}
        isSubmitting={isSubmitting}
        initialValues={selectedAccount || undefined}
        apiMessage={modalApiMessage}
        onClose={handleModalClose}
        onSubmit={handleAccountSave}
      />

      <ConfirmActionModal
        isOpen={Boolean(deleteAccountId)}
        intent="delete"
        variant="danger"
        title="Delete account?"
        description={
          deleteAccountData
            ? `This will permanently delete ${deleteAccountData.name}. This action cannot be undone.`
            : "This action cannot be undone."
        }
        confirmLabel="Delete"
        cancelLabel="Keep"
        apiMessage={deleteApiMessage}
        isLoading={deleteAccountMutation.isPending}
        onClose={handleDeletePromptClose}
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
};

export default Accounts;

import { Copy, Loader2, MenuIcon, Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { useWallet } from "@solana/wallet-adapter-react";
import { formatAddress } from "@/lib/formatAddress";
import { Button } from "../ui/button";
import { copyClipboard } from "@/lib/copyClipboard";
import { toast } from "sonner";
import { useDrift } from "@/contexts/DriftContext";
import { useState } from "react";
import ManageBalance from "./ManageBalance";

export default function Account() {
  const { publicKey, disconnect } = useWallet();
  const { driftClient, subaccounts, balances, isNewUser, refetch } = useDrift();
  const [isCreatingSubaccount, setIsCreatingSubaccount] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  if (!publicKey || !driftClient) return null;

  const user = driftClient?.getUser();
  const activeSubaccount = user?.getUserAccountPublicKey().toBase58();

  const activeSubaccountIndex = subaccounts.findIndex(
    (subaccount) => subaccount === activeSubaccount,
  );

  const initializeSubaccount = async () => {
    setIsCreatingSubaccount(true);
    try {
      let nextSubaccount = 0;
      if (!isNewUser) {
        nextSubaccount = await driftClient.getNextSubAccountId();
      }
      const [userPublickKey] = await driftClient.initializeUserAccount(nextSubaccount);

      if (userPublickKey) {
        refetch();
      }

      toast.success("Subaccount initialized");
    } catch (error) {
      console.error(error);
      toast.error("Failed to initialize subaccount");
    } finally {
      setIsCreatingSubaccount(false);
    }
  };

  const switchAccount = async (subaccount: number) => {
    driftClient.switchActiveUser(subaccount);
    if (subaccount === 0) {
      refetch();
    }
    setOpen(false);
  };

  if (isNewUser) {
    return (
      <>
        {/* CTA - Create subaccount for new user */}
        <Button
          variant="outline"
          className="hidden md:inline-flex h-8"
          onClick={initializeSubaccount}
          disabled={isCreatingSubaccount}
        >
          {isCreatingSubaccount ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Initialize"
          )}
        </Button>
        <Button
          variant="outline"
          className="flex md:hidden h-8"
          onClick={initializeSubaccount}
          disabled={isCreatingSubaccount}
        >
          {isCreatingSubaccount ? (
            <>
              <Loader2 className="size-4 animate-spin" />
            </>
          ) : (
            <Plus className="size-4" />
          )}
        </Button>
      </>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="cursor-pointer">
        <MenuIcon className="w-6 h-6" />
      </SheetTrigger>

      {/* Account Management */}
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-cyan-400">
            {activeSubaccountIndex === 0
              ? "Main Account"
              : `Subaccount ${activeSubaccountIndex + 1}`}
          </SheetTitle>
          <SheetDescription asChild>
            <div className="flex items-center gap-3 text-xs">
              <p>{formatAddress(publicKey.toBase58())}</p>
              <Button
                variant="link"
                size="xs"
                onClick={() => {
                  copyClipboard(publicKey.toBase58());
                  toast.success("Copied to clipboard");
                }}
              >
                <Copy />
              </Button>
              <Button variant="link" size="xs" onClick={disconnect} className="text-red-200">
                Disconnect
              </Button>
            </div>
          </SheetDescription>
        </SheetHeader>

        {/* Balance */}
        <div className="flex flex-col gap-2 px-4 border-b border-neutral-700 pb-2">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-indigo-400">Subaccount Balance</p>
            <h1 className="text-2xl font-medium">
              ${balances[activeSubaccountIndex]?.balanceInUSD.toFixed(2)}
            </h1>
          </div>

          {/* Manage Balance */}
          <ManageBalance />
        </div>

        {/* Subaccounts */}
        <div className="flex flex-col px-2 gap-2 pt-2">
          {subaccounts.map((subaccount, index) => (
            <div
              className="flex py-1.5 px-4 items-center justify-between hover:bg-neutral-900 cursor-pointer"
              key={index}
              onClick={() => switchAccount(index)}
            >
              <span
                className={`flex items-center gap-1 ${activeSubaccountIndex === index ? "bg-clip-text text-transparent bg-gradient-to-r from-orange-300 via-purple-400 to-cyan-400" : "text-neutral-200"}`}
              >
                {formatAddress(subaccount)}
                <Button
                  variant="link"
                  size="xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyClipboard(subaccount);
                    toast.success("Copied to clipboard");
                  }}
                >
                  <Copy />
                </Button>
              </span>
              <p>${balances[index]?.balanceInUSD.toFixed(2)}</p>
            </div>
          ))}

          {/* Add Subaccount */}
          <Button variant="outline" onClick={initializeSubaccount} disabled={isCreatingSubaccount}>
            {isCreatingSubaccount ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus />
                Add Subaccount
              </>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

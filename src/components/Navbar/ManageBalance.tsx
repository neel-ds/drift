import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "../ui/label";
import { useDrift } from "@/contexts/DriftContext";
import { useWallet } from "@solana/wallet-adapter-react";
import { getBalance } from "@/lib/getBalance";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ManageBalance() {
  const { publicKey } = useWallet();
  const { driftClient, subaccounts, balances, refetchBalances } = useDrift();
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState<number | undefined>();
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBalance = async () => {
    if (!publicKey) return;
    const balance = await getBalance([publicKey.toBase58()]);
    setBalance(balance[0].balance);
  };

  useEffect(() => {
    fetchBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey]);

  if (!driftClient) return null;

  const user = driftClient?.getUser();
  const activeSubaccount = user?.getUserAccountPublicKey().toBase58();

  const activeSubaccountIndex = subaccounts.findIndex(
    (subaccount) => subaccount === activeSubaccount,
  );

  const handleDeposit = async () => {
    if (!amount) return;
    setIsLoading(true);

    try {
      const marketIndex = 1;
      const amountToDeposit = driftClient.convertToSpotPrecision(marketIndex, amount);
      const associatedTokenAccount = await driftClient.getAssociatedTokenAccount(marketIndex);

      await driftClient.deposit(amountToDeposit, marketIndex, associatedTokenAccount);
      toast.success("Funds deposited successfully");
      refetchBalances();
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Error depositing funds");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!amount) return;
    setIsLoading(true);

    try {
      const marketIndex = 1;
      const amountToWithdraw = driftClient.convertToSpotPrecision(marketIndex, amount);
      const associatedTokenAccount = await driftClient.getAssociatedTokenAccount(marketIndex);

      await driftClient.withdraw(amountToWithdraw, marketIndex, associatedTokenAccount);
      toast.success("Funds withdrawn successfully");
      refetchBalances();
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Error withdrawing funds");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setAmount(undefined);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-orange-300 via-purple-400 to-cyan-400 text-black hover:from-orange-400 hover:via-purple-500 hover:to-cyan-500">
          Deposit/Withdraw
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Balance</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="deposit">
          <TabsList className="h-10">
            <TabsTrigger
              value="deposit"
              className="px-5 data-[state=active]:bg-transparent data-[state=active]:bg-clip-text data-[state=active]:text-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-300 data-[state=active]:via-purple-400 data-[state=active]:to-cyan-400"
            >
              Deposit
            </TabsTrigger>
            <TabsTrigger
              value="withdraw"
              className="px-5 data-[state=active]:bg-transparent data-[state=active]:bg-clip-text data-[state=active]:text-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-300 data-[state=active]:via-purple-400 data-[state=active]:to-cyan-400"
            >
              Withdraw
            </TabsTrigger>
          </TabsList>
          <TabsContent value="deposit">
            <div className="flex flex-col gap-1 py-5 border-t border-neutral-800 text-center text-neutral-400">
              <Label htmlFor="amount" className="text-xs text-neutral-400">
                Transfer Amount (SOL)
              </Label>
              <Input
                id="amount"
                value={amount}
                type="number"
                onChange={(e) => setAmount(Number(e.target.value))}
                className="bg-neutral-900"
              />
              <div className="flex text-xs items-center justify-between">
                <p>Wallet Balance</p>
                <span className="flex gap-1.5 items-center">
                  {balance.toFixed(4)} SOL
                  <Button
                    variant="link"
                    size="xs"
                    className="text-xs hover:text-white"
                    onClick={() => setAmount(balance / 2)}
                  >
                    50%
                  </Button>
                  <Button
                    variant="link"
                    size="xs"
                    className="text-xs hover:text-white"
                    onClick={() => setAmount(balance)}
                  >
                    Max
                  </Button>
                </span>
              </div>

              <Button
                variant="outline"
                className="mt-3"
                onClick={handleDeposit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Depositing...</span>
                  </>
                ) : (
                  "Deposit"
                )}
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="withdraw">
            <div className="flex flex-col gap-1 py-5 border-t border-neutral-800 text-center text-neutral-400">
              <Label htmlFor="amount" className="text-xs text-neutral-400">
                Transfer Amount (SOL)
              </Label>
              <Input
                id="amount"
                value={amount}
                type="number"
                onChange={(e) => setAmount(Number(e.target.value))}
                className="bg-neutral-900"
              />
              <div className="flex text-xs items-center justify-between">
                <p>Available Balance</p>
                <span className="flex gap-1.5 items-center">
                  {balances[activeSubaccountIndex]?.balance.toFixed(2)} SOL
                  <Button
                    variant="link"
                    size="xs"
                    className="text-xs hover:text-white"
                    onClick={() => setAmount(balances[activeSubaccountIndex]?.balance / 2)}
                  >
                    50%
                  </Button>
                  <Button
                    variant="link"
                    size="xs"
                    className="text-xs hover:text-white"
                    onClick={() => setAmount(balances[activeSubaccountIndex]?.balance)}
                  >
                    Max
                  </Button>
                </span>
              </div>

              <Button
                variant="outline"
                className="mt-3"
                onClick={handleWithdraw}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Withdrawing...</span>
                  </>
                ) : (
                  "Withdraw"
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

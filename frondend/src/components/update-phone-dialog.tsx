// ── Update Phone Dialog ────────────────────────────────────────────────────────

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { PhoneInput } from "./ui/phone-input";

export default function UpdatePhoneDialog({ onDone }: { onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleUpdate = async () => {
    if (!phone) {
      setMsg("Please enter a phone number.");
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/user/update-phone",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ phoneNumber: phone }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.message || "Something went wrong.");
      } else {
        setOpen(false);
        onDone();
      }
    } catch {
      setMsg("Network error. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Update Number
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Update Phone Number</DialogTitle>
          <DialogDescription>
            Enter your new phone number below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <PhoneInput defaultCountry="IN" value={phone} onChange={setPhone} />
          {msg && <p className="text-sm text-destructive">{msg}</p>}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

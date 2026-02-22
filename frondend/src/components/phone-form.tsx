"use client";
import React from "react";
import { PhoneInput } from "./ui/phone-input";
import { Button } from "./ui/button";

function PhoneForm() {
  const [value, setValue] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  const handleSubmit = async () => {
    if (!value) {
      setMessage("Please enter a phone number.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("http://localhost:3000/user/phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // sends the httpOnly JWT cookie
        body: JSON.stringify({ phoneNumber: value }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Something went wrong.");
      } else {
        setMessage("Phone number saved successfully!");
        setValue("");
        window.location.reload();
      }
    } catch (err) {
      setMessage("Network error. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <PhoneInput defaultCountry="IN" value={value} onChange={setValue} />
      <Button
        className="cursor-pointer"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Saving..." : "Submit"}
      </Button>
      {message && (
        <p className="text-sm text-center text-muted-foreground">{message}</p>
      )}
    </div>
  );
}

export default PhoneForm;

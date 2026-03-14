"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { Referral } from "database";
import { joinAffiliateProgram } from "../actions/affiliates.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Copy, Loader2 } from "lucide-react";

interface AffiliatesContentProps {
  referral: Referral | null;
  baseUrl: string;
}

export default function AffiliatesContent({ referral, baseUrl }: AffiliatesContentProps) {
  const t = useTranslations("profile.affiliates");
  const router = useRouter();
  const [ccp, setCcp] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async () => {
    setIsJoining(true);
    try {
      const res = await joinAffiliateProgram({ ccp: ccp.trim() || undefined });
      if (res.success) {
        toast.success(res.message ?? t("joinSuccess"));
        router.refresh();
      } else {
        toast.error(res.message ?? t("joinError"));
      }
    } catch {
      toast.error(t("joinError"));
    } finally {
      setIsJoining(false);
    }
  };

  const getReferralUrl = () => {
    const origin = baseUrl || (typeof window !== "undefined" ? window.location.origin : "");
    return `${origin}/?ref=${referral.id}`;
  };

  const copyLink = () => {
    navigator.clipboard.writeText(getReferralUrl());
    toast.success(t("copied"));
  };

  if (referral) {
    return (
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("yourLink")}</CardTitle>
            <CardDescription className="break-all font-mono text-sm">
              {getReferralUrl()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              type="button"
              variant="secondary"
              onClick={copyLink}
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              {t("copyLink")}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("stats")}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">{t("referralsCount")}</p>
              <p className="text-xl font-semibold">{referral.numberOfReferredStudents}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("totalEarnings")}</p>
              <p className="text-xl font-semibold">{referral.totalEarnings.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("pendingPayout")}</p>
              <p className="text-xl font-semibold">{referral.pendingPayout.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("totalPaidOut")}</p>
              <p className="text-xl font-semibold">{referral.totalPaidOut.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("joinTitle")}</CardTitle>
        <CardDescription>{t("joinDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ccp">{t("ccpLabel")}</Label>
          <Input
            id="ccp"
            value={ccp}
            onChange={(e) => setCcp(e.target.value)}
            placeholder={t("ccpPlaceholder")}
            className="max-w-md"
          />
        </div>
        <Button onClick={handleJoin} disabled={isJoining} className="gap-2">
          {isJoining ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("joining")}
            </>
          ) : (
            t("joinButton")
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

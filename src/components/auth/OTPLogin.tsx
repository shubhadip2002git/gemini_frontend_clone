"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TextInput,
  Button,
  Paper,
  Title,
  Container,
  Select,
  Group,
  Stack,
  Text,
  Loader,
  Image,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Country } from "@/types";
import { countryList } from "@/data/countryList";
import { phoneSchema, PhoneFormData } from "@/schemas/phoneSchema";
import { otpSchema, OTPFormData } from "@/schemas/otpSchema";

interface OTPLoginProps {
  onSuccess: (phoneNumber: string, countryCode: string) => void;
}

export default function OTPLogin({ onSuccess }: OTPLoginProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [phoneData, setPhoneData] = useState<PhoneFormData | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");

  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      countryCode: "",
      phoneNumber: "",
    },
  });

  const otpForm = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((res) => res.json())
      .then((data: Country[]) => {
        const sortedCountries = data
          .filter((country) => country.idd?.root)
          .sort((a, b) => a.name.common.localeCompare(b.name.common));
        setCountries(sortedCountries);
        setLoadingCountries(false);
      })
      .catch(() => {
        const sortedCountries = countryList
          .filter((country) => country.idd?.root)
          .sort((a, b) => a.name.common.localeCompare(b.name.common));
        setCountries(sortedCountries);
        setLoadingCountries(false);
      });
  }, []);

  const onPhoneSubmit = (data: PhoneFormData) => {
    setPhoneData(data);
    setTimeout(() => {
      notifications.show({
        title: "OTP Sent",
        message: "A 6-digit OTP has been sent to your phone number",
        color: "green",
      });
      setStep("otp");
    }, 1000);
  };

  const onOTPSubmit = (data: OTPFormData) => {
    setTimeout(() => {
      if (data.otp === "123456" || data.otp.length === 6) {
        notifications.show({
          title: "Success",
          message: "Login successful!",
          color: "green",
        });
        if (phoneData) {
          onSuccess(phoneData.phoneNumber, phoneData.countryCode);
        }
      } else {
        notifications.show({
          title: "Error",
          message: "Invalid OTP. Please try again.",
          color: "red",
        });
      }
    }, 500);
  };

  const countryOptions = countries.map((country) => {
    const dialCode = country.idd.root + (country.idd.suffixes?.[0] || "");
    return {
      value: dialCode,
      label: `${country.name.common} (${dialCode})`,
      flag: country.flags.svg,
    };
  });

  return (
    <Container size="xs" style={{ marginTop: "5rem" }}>
      <Paper shadow="md" p="xl" radius="md" withBorder>
        <Stack gap="md">
          <Title order={2} ta="center">
            {step === "phone" ? "Welcome" : "Enter OTP"}
          </Title>

          {step === "phone" ? (
            <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)}>
              <Stack gap="md">
                <Select
                  label="Country"
                  placeholder="Select your country"
                  data={countryOptions}
                  searchable
                  nothingFoundMessage="Nothing found..."
                  defaultValue={phoneForm.getValues("countryCode")}
                  disabled={loadingCountries}
                  rightSection={
                    loadingCountries ? <Loader size="xs" /> : undefined
                  }
                  error={phoneForm.formState.errors.countryCode?.message}
                  {...phoneForm.register("countryCode")}
                  onChange={(value) =>
                    phoneForm.setValue("countryCode", value || "")
                  }
                  renderOption={({ option }) => {
                    const customOption = option as {
                      label: string;
                      value: string;
                      flag?: string;
                    };
                    return (
                      <Group justify="space-between" wrap="nowrap">
                        {customOption.flag && (
                          <Image
                            src={customOption.flag}
                            alt="country Image"
                            w={20}
                            h={15}
                            style={{ objectFit: "cover" }}
                          />
                        )}
                        <Text>{customOption.label}</Text>
                      </Group>
                    );
                  }}
                />

                <TextInput
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  type="tel"
                  value={phoneNumber}
                  error={phoneForm.formState.errors.phoneNumber?.message}
                  {...phoneForm.register("phoneNumber")}
                  onChange={(e) => setPhoneNumber(e.currentTarget.value)}
                />

                <Button type="submit" fullWidth mt="md">
                  Send OTP
                </Button>
              </Stack>
            </form>
          ) : (
            <form onSubmit={otpForm.handleSubmit(onOTPSubmit)}>
              <Stack gap="md">
                <Text size="sm" c="dimmed" ta="center">
                  Enter the 6-digit code sent to {phoneData?.countryCode}{" "}
                  {phoneData?.phoneNumber}
                </Text>

                <TextInput
                  label="OTP"
                  placeholder="Enter 6-digit OTP"
                  type="text"
                  maxLength={6}
                  value={otp}
                  error={otpForm.formState.errors.otp?.message}
                  {...otpForm.register("otp")}
                  onChange={(e) => setOtp(e.currentTarget.value)}
                />

                <Group justify="space-between" mt="md">
                  <Button
                    variant="subtle"
                    onClick={() => {
                      setStep("phone");
                      setOtp("");
                      otpForm.setValue("otp", "");
                    }}
                  >
                    Back
                  </Button>
                  <Button type="submit">Verify OTP</Button>
                </Group>
              </Stack>
            </form>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}

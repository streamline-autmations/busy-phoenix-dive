"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useForm, Controller, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bundleSchema } from "./schema";
import { z } from "zod";
import CloudinaryUpload from "./CloudinaryUpload";
import Preview from "./Preview";
import { saveDraft, publishPR, sanitizeBranchName } from "./api";
import { toast } from "sonner";
import { slugify } from "@/lib/slugify";

// Fix import path for UI components to relative path
import {
  Input,
  Label,
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  Textarea,
} from "../../components/ui";

// Fix import path for JSON data to relative path
import productsIndex from "../../content/products/index.json";

type Product = typeof productsIndex[number];

// ... rest of the file unchanged ...
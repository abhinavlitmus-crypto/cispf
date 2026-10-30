import type { Button as ButtonPrimitive } from "@base-ui/react/button";
import type { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import type { VariantProps } from "class-variance-authority";
import type Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import type { EventCategory, EventItem } from "@/constants/events";
import type { NewsItem } from "@/constants/news";
import type { OpportunityItem } from "@/constants/opportunities";
import type { PolicyItem } from "@/constants/policy";
import type { TeamMember } from "@/constants/team";

export type ButtonProps = (
	| (ComponentProps<typeof Link> & { href: string })
	| (ComponentProps<"button"> & { href?: never })
) & { variant?: "solid" | "outline" };

export type ContactEnquiryField = "name" | "email" | "message";
export type ContactEnquiryValues = Record<ContactEnquiryField, string>;
export type ContactEnquiryErrors = Partial<Record<ContactEnquiryField, string>>;

export type ContactEnquiryFormProps = {
	className?: string;
	actionsClassName?: string;
	buttonClassName?: string;
	actions?: ReactNode;
	pendingMessage?: string;
};

export type ContactPopupProps = {
	children: ReactNode;
	triggerClassName?: string;
};

export type EventTabsProps = {
	value: EventCategory;
	onChange: (value: EventCategory) => void;
	idPrefix: string;
	className?: string;
};

export type PaginationProps = {
	page: number;
	pageCount: number;
	onPageChange: (page: number) => void;
	label?: string;
	className?: string;
	tone?: "dark" | "light";
};

export type BackgroundVideoProps = { src: string; poster?: string };
export type EventCardProps = { item: EventItem };
export type JoinUsProps = { className?: string };
export type NewsCardProps = { item: NewsItem; variant?: "default" | "listing" };
export type OpportunityCardProps = { item: OpportunityItem };
export type PageHeroProps = {
	id: string;
	title: string;
	description: string;
	// Without a mobile image, the desktop one is used at every width.
	image: { desktop: string; mobile?: string; alt: string };
	gradient?: boolean;
	border?: boolean;
};
export type PolicyCardProps = {
	item: PolicyItem;
	variant?: "portrait" | "landscape" | "listing";
};
export type TeamCardProps = { member: TeamMember };

export type UIButtonProps<T extends (...args: never[]) => unknown> =
	ButtonPrimitive.Props & VariantProps<T>;

export type SheetProps = SheetPrimitive.Root.Props;
export type SheetTriggerProps = SheetPrimitive.Trigger.Props;
export type SheetCloseProps = SheetPrimitive.Close.Props;
export type SheetPortalProps = SheetPrimitive.Portal.Props;
export type SheetOverlayProps = SheetPrimitive.Backdrop.Props;
export type SheetContentProps = SheetPrimitive.Popup.Props & {
	side?: "top" | "right" | "bottom" | "left";
	showCloseButton?: boolean;
	overlayClassName?: string;
};
export type SheetHeaderProps = ComponentProps<"div">;
export type SheetFooterProps = ComponentProps<"div">;
export type SheetTitleProps = SheetPrimitive.Title.Props;
export type SheetDescriptionProps = SheetPrimitive.Description.Props;

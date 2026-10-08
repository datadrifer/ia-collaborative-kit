/** IA Collaborative: the shadcn/ui components (Radix) Substrate installed in IA's code projects, sized and coloured by IA's tokens. Global: window.IACollaborative */
import type * as React from "react"
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { /** default is IA's blue pill: the one primary action per view */ variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link"; size?: "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"; asChild?: boolean }
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}
export interface CheckboxProps { checked?: boolean | "indeterminate"; defaultChecked?: boolean; onCheckedChange?: (checked: boolean | "indeterminate") => void; disabled?: boolean; id?: string }
export interface SwitchProps { checked?: boolean; defaultChecked?: boolean; onCheckedChange?: (checked: boolean) => void; size?: "default" | "sm"; id?: string }
export interface RadioGroupProps { value?: string; defaultValue?: string; onValueChange?: (value: string) => void }
export interface SelectProps { value?: string; defaultValue?: string; onValueChange?: (value: string) => void; open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void }
export interface TabsProps { value?: string; defaultValue?: string; onValueChange?: (value: string) => void; orientation?: "horizontal" | "vertical" }
export interface AccordionProps { type: "single" | "multiple"; collapsible?: boolean; defaultValue?: string | string[]; value?: string | string[] }
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> { size?: "default" | "sm" }
export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {}
export interface AvatarProps { size?: "default" | "sm" | "lg" }
export interface SeparatorProps { orientation?: "horizontal" | "vertical"; decorative?: boolean }
export interface DialogProps { open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; modal?: boolean }
export interface SheetProps { open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void }
export interface PopoverProps { open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void }
export interface TooltipProps { open?: boolean; defaultOpen?: boolean; delayDuration?: number }
export interface DropdownMenuProps { open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; modal?: boolean }
export interface NavigationMenuProps { value?: string; defaultValue?: string; onValueChange?: (value: string) => void }
export interface CommandProps { value?: string; onValueChange?: (value: string) => void; filter?: (value: string, search: string) => number }
export interface ToasterProps { position?: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"; expand?: boolean }

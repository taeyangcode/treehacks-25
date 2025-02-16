"use client";

import { useAuth } from "@/utils/supabase/auth";
import Logo from "../../../public/logo.png";

import { motion } from "framer-motion";
import { MessageSquarePlus, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export interface SidebarProps {}

export default function Sidebar(props: SidebarProps) {
	const [open, setOpen] = useState(false);
	const [animationComplete, setAnimationComplete] = useState(false);

	const { user, fetchUser } = useAuth();

	useEffect(() => {
		fetchUser();
	}, []);

	return (
		<motion.div
			initial={{ minWidth: "50px" }}
			animate={{ minWidth: open ? "250px" : "50px" }}
			transition={{ duration: 0.3, ease: "easeInOut" }}
			onAnimationComplete={() => setAnimationComplete(open)}
			className="absolute left-0 flex h-full w-fit flex-col items-center justify-between border-r-2 border-[#363636] bg-transparent px-4 py-20 backdrop-blur-lg"
		>
			{/* Top Buttons */}
			<div className="flex h-1/2 w-full flex-col items-center justify-start">
				<div className="flex h-fit w-full flex-col items-center justify-between gap-y-14">
					{/* Logo */}
					<div className="flex h-fit w-full flex-row items-center justify-start gap-x-5 gap-y-8">
						<Image alt="Logo" src={Logo} className="w-[50px] rounded-lg bg-gray-300 object-contain" />
						{open && animationComplete && (
							<motion.span
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.1 }}
								className="font-manrope text-3xl font-bold tracking-wide text-white/80"
							>
								Odin
							</motion.span>
						)}
					</div>

					<div className="flex h-fit w-full flex-col items-start justify-between gap-y-2">
						{/* Panel Open/Close Button */}
						<SidebarButton
							icon={
								open ? (
									<PanelLeftClose className="w-[50px] stroke-gray-300 group-hover:stroke-gray-100" />
								) : (
									<PanelLeftOpen className="w-[50px] stroke-gray-300 group-hover:stroke-gray-100" />
								)
							}
							label="Close sidebar"
							onClick={() => setOpen(!open)}
							open={open}
							animationComplete={animationComplete}
							index={0}
						/>

						{/* New session Button */}
						<SidebarButton
							icon={
								<MessageSquarePlus className="w-[50px] stroke-gray-300 group-hover:stroke-gray-100" />
							}
							label="New session"
							open={open}
							animationComplete={animationComplete}
							index={1}
						/>
					</div>

					{/* Sessions */}
					{open && animationComplete && (
						<div className="flex h-fit w-full flex-col items-start justify-between gap-y-4">
							<span className="font-manrope text-2xl font-bold text-white/80">Sessions</span>
							<div className="flex h-fit w-full flex-col items-start justify-between gap-y-2">
								{[
									"Session 1",
									"Session 2",
									"Session 3",
									"Session 4",
									"Long Long Really Long Session 5",
								].map((session, index) => (
									<motion.button
										key={index}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: index * 0.04 + 0.1 }}
										className="flex w-full max-w-[250px] justify-start rounded-md px-3 py-2 hover:bg-[#363636]/60"
									>
										<span className="overflow-hidden overflow-ellipsis whitespace-nowrap text-start font-manrope text-lg font-semibold tracking-wide text-white/80">
											{session}
										</span>
									</motion.button>
								))}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Bottom Buttons */}
			<div className="h-fit w-full">
				{/* User */}
				<div className="flex h-fit w-full flex-row items-start justify-start gap-x-5 gap-y-8">
					{user ? (
						<img
							alt="Profile"
							src={user?.user_metadata?.avatar_url}
							className="w-[50px] rounded-full bg-gray-300 object-contain"
						/>
					) : (
						<div className="aspect-square w-[50px] animate-pulse rounded-full bg-gray-300"></div>
					)}
				</div>
			</div>
		</motion.div>
	);
}

interface SidebarButtonProps {
	icon: React.ReactNode;
	label: string;
	onClick?: () => void;
	open: boolean;
	animationComplete: boolean;
	index: number;
}

function SidebarButton(props: SidebarButtonProps) {
	const { icon, label, onClick, open, animationComplete, index } = props;

	return (
		<button
			className="group flex h-[50px] w-full flex-row items-center gap-x-4 rounded-md transition duration-200 hover:bg-[#363636]/60"
			onClick={onClick}
		>
			{icon}
			{open && animationComplete && (
				<motion.span
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: index * 0.17 + 0.2 }}
					className="font-manrope text-lg font-bold tracking-wide text-white/80"
				>
					{label}
				</motion.span>
			)}
		</button>
	);
}

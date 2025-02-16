import Sidebar from "@/components/Sidebar/Sidebar";

export interface LayoutProps {
	children: React.ReactNode;
}

export default function Layout(props: LayoutProps) {
	const { children } = props;

	return (
		<div className="flex h-full w-full">
			<Sidebar />
			<div className="h-full w-full">{children}</div>
		</div>
	);
}

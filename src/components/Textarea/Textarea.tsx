import { Bird } from "lucide-react";
import { SetStateAction, useEffect, useRef } from "react";

export interface TextareaProps {
	value: string;
	onChange: React.Dispatch<SetStateAction<string>>;
	placeholder: string;
	inputDisabled: boolean;
	submitDisabled: boolean;
	onSubmit?: () => void;
}

export default function Textarea(props: TextareaProps) {
	const { value, onChange, placeholder, inputDisabled, submitDisabled, onSubmit } = props;
	const divRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (divRef.current && divRef.current.textContent !== value) {
			divRef.current.textContent = value;
		}
	}, [value]);

	const isPlaceholderVisible = value === placeholder;

	return (
		<div className="relative min-h-[120px] w-[750px]">
			<div
				ref={divRef}
				contentEditable={!inputDisabled}
				onInput={(e) => onChange(e.currentTarget.textContent || "")}
				onFocus={(e) => {
					if (e.currentTarget.textContent === placeholder) {
						e.currentTarget.textContent = "";
					}
				}}
				onBlur={(e) => {
					if (!e.currentTarget.textContent) {
						e.currentTarget.textContent = placeholder;
					}
				}}
				className={`relative min-h-[120px] w-full resize-none rounded-lg border-none bg-[#1f1f1f] p-6 font-manrope text-xl font-medium ring-2 ring-[#363636] transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-300/90 ${
					isPlaceholderVisible ? "text-red-900/20" : "text-white/90"
				}`}
				suppressContentEditableWarning={true}
				tabIndex={0}
			></div>

			{/* Submit button with Bird icon */}
			<button
				onClick={onSubmit}
				disabled={submitDisabled}
				className={`absolute bottom-4 right-4 rounded-full p-2 transition ${
					submitDisabled ? "cursor-not-allowed opacity-50" : "hover:bg-gray-700"
				}`}
			>
				<Bird size={28} className="stroke-gray-300" />
			</button>
		</div>
	);
}

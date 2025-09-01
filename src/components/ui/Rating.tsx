import { StarIcon } from "lucide-react";
import { useRef, useState } from "react";

interface RatingProps {
	readOnly?: boolean;
	rating?: number;
	onChange?: (val: number) => void;
	size?: number;
}

export function Rating({
	rating: initialRating,
	onChange,
	readOnly = false,
	size = 16,
}: RatingProps) {
	const [rating, setRating] = useState(initialRating ?? 0);
	const [hoverValue, setHoverValue] = useState(0);
	const containerRef = useRef<HTMLDivElement>(null);

	const calculateRating = (clientX: number) => {
		if (!containerRef.current) return 0;
		const rect = containerRef.current.getBoundingClientRect();
		const x = clientX - rect.left;
		const clampedX = Math.max(0, Math.min(x, rect.width));
		const stars = (clampedX / rect.width) * 5;
		return Math.round(stars * 2) / 2;
	};

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (readOnly) return;
		const newRating = calculateRating(e.clientX);
		setHoverValue(newRating);
	};

	const handleMouseLeave = () => {
		if (readOnly) return;
		setHoverValue(0);
	};

	const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (readOnly) return;
		const newRating = calculateRating(e.clientX);
		setRating(newRating);
		onChange?.(newRating);
	};

	const displayValue = hoverValue > 0 ? hoverValue : rating;

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<div
			ref={containerRef}
			className="flex gap-1 p-0 m-0 w-fit"
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			onClick={handleClick}
		>
			{Array.from({ length: 5 }).map((_, i) => {
				const starIndex = i + 1;
				const isFilled = displayValue >= starIndex;
				const isHalfFilled = displayValue > i && displayValue < starIndex;

				return (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={i}
						className="relative cursor-pointer"
					>
						<StarIcon
							size={size}
							className="text-yellow-500 transition-all duration-250"
						/>
						{isHalfFilled && (
							<div className="absolute top-0 left-0 w-1/2 h-full overflow-hidden">
								<StarIcon
									size={size}
									className="text-yellow-500 fill-yellow-500 transition-all duration-250"
								/>
							</div>
						)}
						{isFilled && !isHalfFilled && (
							<StarIcon
								size={size}
								className="absolute top-0 left-0 text-yellow-500 fill-yellow-500 transition-all duration-250"
							/>
						)}
					</div>
				);
			})}
		</div>
	);
}

export default function Header() {
	return (
		<header
			className="flex flex-col items-center h-[22px] w-full"
			aria-hidden="true"
		>
			{/* <div className="gr-gray-line h-[1px] w-full"></div> */}
			<div className="flex w-[1284px] grow ">
				<div className="bg-gray-line w-[1px] h-full"></div>
				<div className="gr-green-medium w-[calc(862px)] h-full opacity-55"></div>
				<div className="bg-gray-line w-[1px] h-full"></div>
			</div>
			<div className="gr-gray-line h-[1px] w-full"></div>
		</header>
	);
}

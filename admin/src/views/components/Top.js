import { Avatar } from "antd";
import { LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import commonObj from "../../commonObj";
import { useLogoutSaveMutation } from "../../query/logout.query";

export default function Top() {
	const useSave = useLogoutSaveMutation();
	const navigate = useNavigate();
	const EraseUserData = () => {
		const dateOnly = () => {
			const d = new Date();
			d.setHours(0, 0, 0, 0);
			return d;
		};

		const todayDate = dateOnly();
		const payload = {
			userId: commonObj?._id,
			date: todayDate,
		};
		useSave.mutate(
			payload
		)
		window.localStorage.clear();
		navigate("/", { replace: true });
		window.location.reload();
	};
	const capitalizeFirstLetter = (str = "") => str.charAt(0).toUpperCase() + str.slice(1);
	return (
		<div className="flex gap-x-6 items-center">
			<Link to={"/profile"} className="flex items-center gap-x-3">
				<span className="text-sm font-medium text-[#4B5563]">
					Hi, {commonObj?.name ? capitalizeFirstLetter(commonObj?.name) : "Admin"}
				</span>
				<Avatar
					size={38}
					src={commonObj?.avatar || undefined}
					icon={<User className="w-5 h-5" />}
					className="flex items-center justify-center bg-primary"
				/>
			</Link>
			<button
				onClick={EraseUserData}
				title="Logout"
				className="flex items-center gap-x-2 text-sm text-[#4B5563] hover:text-primary group"
			>
				<LogOut
					className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-[4px]"
				/>
				<span>Logout</span>
			</button>
		</div>
	);
}

import Loader from "./loader";
export default function SiteLoader() {
	return (
		<div className="bg-[#81AFD1]/60 h-screen flex flex-col justify-center">
			<p className="flex justify-center">
				<Loader />
			</p>
		</div>
	);
}

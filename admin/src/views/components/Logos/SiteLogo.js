export const SiteLogoBig = () => {
	return <img src="/logo-dark.svg" alt="logo" className="w-[220px]"/>;
};

export const SiteLogoSmall = () => {
	return <img src={`${process.env.PUBLIC_URL}/favicon.svg`} alt="logo" className="w-16"/>;
};



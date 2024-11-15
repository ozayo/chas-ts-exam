import { Outlet, useLocation } from "react-router-dom";

function Layout() {
	const location = useLocation()



	return (
		<>
			<main
      className={`pb-[16px] ${
        location.pathname == "/cart"
          ? "bg-ash"
          : location.pathname == "/order-result" || location.pathname.startsWith("/receipt")
          ? "bg-clay"
          : "bg-dark-mint"
      } pt-[80px] w-full h-full min-h-screen`}
    >
      <Outlet />
    </main>
		</>
	);
}

export default Layout;

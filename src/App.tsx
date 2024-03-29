import Help from "@/components/Help";
import { Toaster } from "@/components/ui/toaster";
import Admin from "@/pages/Admin";
import Chat from "@/pages/Chat";
import Create from "@/pages/Create";
import Home from "@/pages/Home";
import Print from "@/pages/Print";
import { MessageSquareText } from "lucide-react";
import { Link, useLocation, useRoutes } from "react-router-dom";
import ChatLogin from "./pages/ChatLogin";

const App = () => {
  const location = useLocation();
  const routes = useRoutes([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/create",
      element: <Create />,
    },
    {
      path: "/admin/:chat_id",
      element: <Admin />,
    },
    {
      path: "/login/:chat_id",
      element: <ChatLogin />,
    },
    {
      path: "/chat/:chat_id",
      element: <Chat />,
    },
    {
      path: "/print/:chat_id/:images_per_a4",
      element: <Print />,
    },
  ]);

  console.log(location.pathname, location.pathname.includes("/print/"));
  return (
    <>
      {!location.pathname.includes("/print/") && (
        <>
          <nav className="fixed top-0 left-0 bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/30 w-screen flex justify-between px-3 sm:px-8 py-5">
            <Link
              to="/"
              className="flex gap-2 items-center font-serif text-xl sm:text-2xl font-semibold"
            >
              <MessageSquareText className="text-primary" size={48} />
              Debatní chat
            </Link>

            <Help></Help>
          </nav>

          <main className="min-h-screen w-screen flex justify-center items-center py-32 px-3">
            {routes}
            <Toaster />
          </main>
        </>
      )}
      {location.pathname.includes("/print/") && routes}
    </>
  );
};

export default App;

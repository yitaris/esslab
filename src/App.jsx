import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/SupabaseContext";

function App() {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.title === "Mağaza Müdürü") {
      navigate("/home");
    }else if (!user) { 
      navigate("/signIn");
    }else {
      navigate("/verify");
    }
  }, [user, navigate]);

  return <></>;
}

export default App;

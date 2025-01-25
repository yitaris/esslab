import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabaseClient";
import { ubgida } from "../assets";
import { UserAuth } from "../context/SupabaseContext";

//page//
import FetchBarista from "../fetch/FetchBarista";

const Barista = () => {
  const { session, signOut } = UserAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("add");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async (e) => {
    e.preventDefault();

    try {
      await signOut();
      navigate("/");
    } catch (err) {
      setError("An unexpected error occurred."); // Catch unexpected errors
    }
  };

  
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setMenuOpen(false);
  };

  return (
    <div className="w-full h-full relative bg-[#09090b] text-black grid grid-rows-[80px,1fr]">
        {/* HEADER */}
        <div className="w-full relative px-5">
            <img
                src={ubgida}
                className="w-20 h-20"
            />
            
            
        </div>
        {/* Main Content */}
        <motion.div
          className="h-screen"
          initial="hidden"
          animate="visible"
        >
          {selectedCategory === "add" && <FetchBarista />}
        </motion.div>
      
    </div>
  );
};

export default Barista;

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

const ContentContext = createContext();

export const useContent = () => useContext(ContentContext);

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // İçeriği Supabase'ten çek
  const fetchContent = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("content")
        .select("data, id")
        .order("id", { ascending: true })
        .limit(1);
      if (error) throw error;
      if (data && data.length > 0) {
        setContent({ ...data[0].data, _supabaseId: data[0].id });
        setError("");
      } else {
        // Hiç veri yoksa, ilk defa ekle
        const defaultData = {
          title: "İyiki Sen Sevgilim",
          description: "Birlikte geçirdiğimiz her an, bu sitede sonsuza dek yaşayacak...",
          bannerText: "Birlikte her an, sonsuz bir masal gibi...",
          welcomeMessage: "Hoş geldin Gülüm…",
          closingMessage: "",
          gallery: [],
          music: [],
          timeline: []
        };
        const { data: insertData, error: insertError } = await supabase
          .from("content")
          .insert([{ data: defaultData }])
          .select();
        if (insertError) throw insertError;
        setContent({ ...defaultData, _supabaseId: insertData[0].id });
        setError("");
      }
    } catch (err) {
      console.error("Error fetching content from Supabase:", err);
      setError("İçerik yüklenemedi");
      setContent(null);
    }
    setLoading(false);
  };

  // İçeriği Supabase'e kaydet
  const updateContent = async (newData) => {
    setLoading(true);
    try {
      let id = newData._supabaseId;
      const dataToSave = { ...newData };
      delete dataToSave._supabaseId;
      if (!id && content && content._supabaseId) id = content._supabaseId;
      if (id) {
        // Güncelle
        const { data: updateData, error: updateError } = await supabase
          .from("content")
          .update({ data: dataToSave })
          .eq("id", id)
          .select();
        if (updateError) throw updateError;
        setContent({ ...updateData[0].data, _supabaseId: updateData[0].id });
        setError("");
      } else {
        // Ekle
        const { data: insertData, error: insertError } = await supabase
          .from("content")
          .insert([{ data: dataToSave }])
          .select();
        if (insertError) throw insertError;
        setContent({ ...insertData[0].data, _supabaseId: insertData[0].id });
        setError("");
      }
    } catch (err) {
      console.error("Error updating content in Supabase:", err);
      setError("İçerik güncellenemedi");
      setContent(prev => ({ ...prev, ...newData }));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContent();
    // eslint-disable-next-line
  }, []);

  return (
    <ContentContext.Provider value={{ content, loading, error, fetchContent, updateContent }}>
      {children}
    </ContentContext.Provider>
  );
}; 
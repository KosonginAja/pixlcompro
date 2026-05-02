import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import toast from "react-hot-toast";
import { Save, Loader2, Mail, Plus, Trash2, Link as LinkIcon, AlertCircle } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import ImageUploader from "../../components/ImageUploader";

const ManageAbout = () => {
  const [formData, setFormData] = useState({
    description_en: "",
    description_id: "",
    vision_en: "",
    vision_id: "",
    mission_en: "",
    mission_id: "",
    founded: "",
    clients: "",
    projects: "",
    contact_email: "",
    contact_phone: "",
    socials: [],
    image: null,
    logo: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [recordId, setRecordId] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const { data, error } = await supabase
          .from("about")
          .select("*")
          .single();
        if (error && error.code !== "PGRST116") throw error;

        if (data) {
          setRecordId(data.id);
          setFormData({
            description_en: data.description_en || "",
            description_id: data.description_id || "",
            vision_en: data.vision_en || "",
            vision_id: data.vision_id || "",
            mission_en: data.mission_en || "",
            mission_id: data.mission_id || "",
            founded: data.founded || "",
            clients: data.clients || "",
            projects: data.projects || "",
            contact_email: data.contact_email || "",
            contact_phone: data.contact_phone || "",
            socials: data.socials || [],
            image: null,
            logo: null,
          });
          if (data.image) setPreview(data.image);
          if (data.logo) setLogoPreview(data.logo);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load company details");
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  const uploadFile = async (file, pathPrefix) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${pathPrefix}_${Date.now()}.${fileExt}`;
    const filePath = `${pathPrefix}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let imageUrl = preview;
      let logoUrl = logoPreview;

      if (formData.image instanceof File) {
        imageUrl = await uploadFile(formData.image, "about");
      }
      if (formData.logo instanceof File) {
        logoUrl = await uploadFile(formData.logo, "logo");
      }

      const updateData = {
        description_en: formData.description_en,
        description_id: formData.description_id,
        vision_en: formData.vision_en,
        vision_id: formData.vision_id,
        mission_en: formData.mission_en,
        mission_id: formData.mission_id,
        founded: formData.founded,
        clients: formData.clients,
        projects: formData.projects,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        socials: formData.socials,
        image: imageUrl,
        logo: logoUrl,
        updated_at: new Date(),
      };

      if (recordId) {
        const { error } = await supabase
          .from("about")
          .update(updateData)
          .eq("id", recordId);
        if (error) throw error;
      } else {
        const { data: inserted, error } = await supabase
          .from("about")
          .insert([updateData])
          .select();
        if (error) throw error;
        setRecordId(inserted[0].id);
      }

      toast.success("Company profile updated!");
      setPreview(imageUrl);
      setLogoPreview(logoUrl);
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="p-8">
        <Loader2 className="animate-spin text-primary-500" />
      </div>
    );

  return (
    <div className="max-w-5xl">
      <PageHeader title="Company Profile" />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-10">
          <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
              Core Description
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                  About Us (EN)
                </label>
                <textarea
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-sm leading-relaxed"
                  value={formData.description_en}
                  onChange={(e) =>
                    setFormData({ ...formData, description_en: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                  Tentang Kami (ID)
                </label>
                <textarea
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-sm leading-relaxed"
                  value={formData.description_id}
                  onChange={(e) =>
                    setFormData({ ...formData, description_id: e.target.value })
                  }
                />
              </div>
            </div>
          </section>

          <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
              Vision &amp; Mission
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                    Vision (EN)
                  </label>
                  <textarea
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-sm"
                    value={formData.vision_en}
                    onChange={(e) =>
                      setFormData({ ...formData, vision_en: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                    Visi (ID)
                  </label>
                  <textarea
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-sm"
                    value={formData.vision_id}
                    onChange={(e) =>
                      setFormData({ ...formData, vision_id: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                    Mission (EN)
                  </label>
                  <textarea
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-sm"
                    value={formData.mission_en}
                    onChange={(e) =>
                      setFormData({ ...formData, mission_en: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                    Misi (ID)
                  </label>
                  <textarea
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-sm"
                    value={formData.mission_id}
                    onChange={(e) =>
                      setFormData({ ...formData, mission_id: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                Facts &amp; Stats
              </h2>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                    Founded Year
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-sm"
                    value={formData.founded}
                    onChange={(e) =>
                      setFormData({ ...formData, founded: e.target.value })
                    }
                    placeholder="e.g. 2015"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                    Total Clients
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-sm"
                    value={formData.clients}
                    onChange={(e) =>
                      setFormData({ ...formData, clients: e.target.value })
                    }
                    placeholder="e.g. 500+"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                    Completed Projects
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-sm"
                    value={formData.projects}
                    onChange={(e) =>
                      setFormData({ ...formData, projects: e.target.value })
                    }
                    placeholder="e.g. 1000+"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                Public Contact
              </h2>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-1.5">
                    <Mail size={12} className="text-primary-500" /> Primary Email
                  </label>
                  <input
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact_email: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-sm"
                    placeholder="hello@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-1.5">
                    <i className="fa-brands fa-whatsapp text-green-500"></i> WhatsApp
                  </label>
                  <input
                    type="text"
                    value={formData.contact_phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact_phone: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-sm"
                    placeholder="e.g. 08123456789"
                  />
                </div>
              </div>
            </div>
            
            {/* DYNAMIC SOCIAL MEDIA SECTION */}
            <div className="space-y-6 lg:col-span-2 mt-4 pt-8 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                  Social Media Links
                </h2>
                <button
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    socials: [...formData.socials, { label: "Facebook", url: "", icon: "fa-brands fa-facebook" }]
                  })}
                  className="flex items-center gap-1.5 text-xs font-bold bg-primary-50 text-primary-600 hover:bg-primary-500 hover:text-white px-3 py-1.5 rounded-lg transition-colors border border-primary-100 uppercase tracking-wider"
                >
                  <Plus size={14} /> Add Social
                </button>
              </div>

              {formData.socials.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <p className="text-sm font-medium text-gray-400">No social media links added yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.socials.map((social, index) => (
                    <div key={index} className="flex flex-col gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm relative group hover:border-primary-300 transition-colors">
                      <button
                        type="button"
                        onClick={() => {
                          const newSocials = [...formData.socials];
                          newSocials.splice(index, 1);
                          setFormData({ ...formData, socials: newSocials });
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-500 hover:bg-red-500 hover:text-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all z-10"
                        title="Remove"
                      >
                        <Trash2 size={12} />
                      </button>

                      <div className="flex gap-3">
                        <div className="flex-1 space-y-2">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Platform Name</label>
                          <input
                            type="text"
                            value={social.label}
                            onChange={(e) => {
                              const newSocials = [...formData.socials];
                              newSocials[index].label = e.target.value;
                              
                              // Auto-guess icon if empty or default
                              const val = e.target.value.toLowerCase();
                              if (val.includes('instagram')) newSocials[index].icon = "fa-brands fa-instagram";
                              else if (val.includes('linkedin')) newSocials[index].icon = "fa-brands fa-linkedin-in";
                              else if (val.includes('facebook')) newSocials[index].icon = "fa-brands fa-facebook";
                              else if (val.includes('tiktok')) newSocials[index].icon = "fa-brands fa-tiktok";
                              else if (val.includes('twitter') || val === 'x') newSocials[index].icon = "fa-brands fa-x-twitter";
                              else if (val.includes('youtube')) newSocials[index].icon = "fa-brands fa-youtube";
                              else if (val.includes('github')) newSocials[index].icon = "fa-brands fa-github";
                              
                              setFormData({ ...formData, socials: newSocials });
                            }}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 text-sm outline-none"
                            placeholder="e.g. TikTok"
                          />
                        </div>
                        <div className="w-16 space-y-2">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Preview</label>
                          <div className="h-[38px] w-full bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 text-lg">
                            <i className={social.icon || "fa-solid fa-link"}></i>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                         <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Profile URL</label>
                         <div className="relative">
                           <LinkIcon size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                           <input
                             type="url"
                             value={social.url}
                             onChange={(e) => {
                               const newSocials = [...formData.socials];
                               newSocials[index].url = e.target.value;
                               setFormData({ ...formData, socials: newSocials });
                             }}
                             className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 text-sm outline-none font-mono"
                             placeholder="https://"
                           />
                         </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>

          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ImageUploader
              label="Brand Logo"
              hint="1:1 Ratio (Square) - Appears on Navbar, Footer & Sidebar"
              preview={logoPreview}
              onChange={(file, url) => {
                setFormData({ ...formData, logo: file });
                setLogoPreview(url);
              }}
              heightClass="h-40 sm:h-56 w-full"
            />
            <ImageUploader
              label="Company Feature Image"
              hint="800x800px recommended - Appears on About Us section"
              preview={preview}
              onChange={(file, url) => {
                setFormData({ ...formData, image: file });
                setPreview(url);
              }}
              heightClass="h-40 sm:h-56 w-full"
            />
          </section>

          <div className="pt-8 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-70 shadow-sm"
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {saving ? "Saving Profile..." : "Save Company Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageAbout;

"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import LanguageIcon from "@mui/icons-material/Language";
import PasswordIcon from "@mui/icons-material/Password";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Editarperfilaluno: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    name: "Aluno",
    email: "",
    accountType: "Estudante",
  });
  const [profileImage, setProfileImage] = useState("/images/profile-icon.png");
  const [showTranslator, setShowTranslator] = useState(false);
  
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  
  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Delete account states
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser({
        name: userData.name || "Aluno",
        email: userData.email || "",
        accountType: userData.accountType || "Estudante",
      });

      const storedImage = localStorage.getItem("profileImage");
      if (storedImage) {
        setProfileImage(storedImage);
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfileImage(e.target.result as string);
          localStorage.setItem("profileImage", e.target.result as string);
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleLanguageToggle = () => {
    if (showTranslator) {
      setShowTranslator(false);
    } else {
      setShowTranslator(true);
      if (!document.querySelector("#google_translate_script")) {
        const script = document.createElement("script");
        script.id = "google_translate_script";
        script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        document.body.appendChild(script);

        // Define a função de callback global para o tradutor
        (window as any).googleTranslateElementInit = () => {
          new (window as any).google.translate.TranslateElement(
            {
              pageLanguage: "pt", // Define o idioma da página como Português
              includedLanguages: "en,pt,es,fr,de,it", // Idiomas incluídos
              layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
            },
            "google_translate_element"
          );
        };
      }
    }
  };

  const handlePasswordChange = () => {
    setPasswordError("");
    setPasswordSuccess("");
    
    // Validações
    if (!currentPassword) {
      setPasswordError("Por favor, insira sua senha atual.");
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError("Nova senha deve ter pelo menos 6 caracteres.");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError("As senhas não correspondem.");
      return;
    }

    // Aqui você implementaria a lógica para verificar a senha atual
    // e atualizar para a nova no seu backend
    
    // Simular sucesso após validação
    setPasswordSuccess("Senha alterada com sucesso!");
    
    // Limpar campos após sucesso
    setTimeout(() => {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSuccess("");
      setShowPasswordModal(false);
    }, 2000);
  };

  const handleDeleteAccount = () => {
    setDeleteError("");
    
    // Verificar se digitou a confirmação correta
    if (deleteConfirmation !== "DELETAR") {
      setDeleteError('Digite "DELETAR" para confirmar a exclusão da conta.');
      return;
    }
    
    // Aqui você implementaria a lógica para excluir a conta no backend
    
    // Limpar dados do localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("profileImage");
    
    // Redirecionar para login após exclusão
    router.push("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("profileImage");
    router.push("/login");
  };

  const resetPasswordModal = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setPasswordSuccess("");
    setShowPasswordModal(false);
  };

  const resetDeleteModal = () => {
    setDeleteConfirmation("");
    setDeleteError("");
    setShowDeleteAccountModal(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center text-white p-8 bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/images/sooroxo.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Header */}
      <header className="w-full container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <Image
            onClick={() => router.push("/dashboardaluno")}
            src="/images/markim-Photoroom.png"
            alt="Logo Projeto Galileu"
            width={150}
            height={50}
            className="hover:scale-105 transition-transform duration-300"
          />
        </div>
        <nav>
          <ul className="flex flex-wrap justify-center gap-6 items-center">
            <li>
              <button
                onClick={() => router.push("/dashboardaluno")}
                className="text-white hover:text-purple-300 px-6 py-3 rounded-md transition duration-300"
              >
                Início
              </button>
            </li>
            
            <li>
              <button
                onClick={() => router.push("/simulacoesaluno")}
                className="text-white px-6 py-3 rounded-md font-bold border border-purple-400"
              >
                Simulações
              </button>
            </li>
            <li>
              <button
                onClick={() => router.push("/editarperfilaluno")}
                className="bg-purple-600 text-white px-8 py-3 rounded-md font-bold transition duration-300 flex items-center gap-2"
              >
                <AccountCircleOutlinedIcon />
                {user.name}
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Containers de Edição */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 w-full max-w-5xl mt-12">
        {/* Container da Esquerda */}
        <div className="bg-purple-800 p-8 rounded-lg w-full md:w-2/5 shadow-lg border border-purple-400">
          <div className="space-y-5">
            <button 
              className="w-full bg-red-600 py-3 rounded-md hover:bg-red-500 flex items-center justify-center gap-2 text-lg"
              onClick={() => setShowDeleteAccountModal(true)}
            >
              <DeleteIcon />
              Deletar conta
            </button>
            <button
              className="w-full bg-yellow-500 py-3 rounded-md hover:bg-yellow-400 flex items-center justify-center gap-2 text-lg"
              onClick={() => setShowAccountModal(true)}
            >
              <AccountCircleOutlinedIcon />
              Mudar tipo de conta
            </button>
            <button 
              className="w-full bg-blue-500 py-3 rounded-md hover:bg-blue-400 flex items-center justify-center gap-2 text-lg"
              onClick={() => setShowPasswordModal(true)}
            >
              <PasswordIcon />
              Alterar Senha
            </button>
            <button
              className="w-full bg-gray-600 py-3 rounded-md hover:bg-gray-500 flex items-center justify-center gap-2 text-lg"
              onClick={handleLanguageToggle}
            >
              <LanguageIcon />
              Idioma
            </button>
            {showTranslator && (
              <div id="google_translate_element" className="mt-4 text-black bg-white rounded-md p-2" />
            )}
          </div>
        </div>

        {/* Container da Direita */}
        <div className="bg-purple-900 p-10 rounded-lg w-full md:w-3/5 shadow-lg border border-purple-400 bg-opacity-90 flex flex-col items-center">
          <div className="relative">
            <Image
              src={profileImage}
              alt="Perfil"
              width={150}
              height={150}
              className="rounded-full border-4 border-purple-400 object-cover"
            />
            <input
              type="file"
              accept="image/*"
              id="fileInput"
              className="hidden"
              onChange={handleImageChange}
            />
            <label
              htmlFor="fileInput"
              className="absolute bottom-0 right-0 bg-purple-500 p-3 rounded-full text-white hover:bg-purple-600 transition cursor-pointer"
            >
              <PhotoCameraIcon />
            </label>
          </div>

          <div className="mt-6 text-center">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-md text-gray-300">
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <p className="text-md text-gray-400 mt-2">
              <span className="font-semibold">Tipo de Conta:</span> Estudante
            </p>
          </div>

          <button
            className="mt-8 w-full bg-purple-600 py-3 rounded-md hover:bg-purple-500 flex justify-center items-center gap-2 text-lg"
            onClick={() => setShowLogoutModal(true)}
          >
            <LogoutIcon />
            Encerrar sessão
          </button>
        </div>
      </div>

      {/* MODAL - Mudar Tipo de Conta */}
      {showAccountModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-purple-900 border border-purple-400 p-8 rounded-lg text-center shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-6">Escolha o tipo de conta</h2>
            <button 
              onClick={() => router.push("")}
              className={`w-full py-3 rounded-md mb-4 ${user.accountType === "Estudante" ? "bg-purple-600 text-white" : "bg-white text-purple-600 border border-purple-600"}`}
            >
              Estudante
            </button>
            <button 
              onClick={() => router.push("/editarperfilprof")}
              className={`w-full py-3 rounded-md ${user.accountType === "Professor" ? "bg-purple-600 text-white" : "bg-white text-purple-600 border border-purple-600"}`}
            >
              Professor
            </button>
            <button className="mt-4 text-white hover:text-gray-300" onClick={() => setShowAccountModal(false)}>
              <CloseIcon /> Fechar
            </button>
          </div>
        </div>
      )}

      {/* MODAL - Alteração de Senha */}
      {showPasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-purple-900 border border-purple-400 p-8 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Alterar Senha</h2>
              <button className="text-white hover:text-gray-300" onClick={resetPasswordModal}>
                <CloseIcon />
              </button>
            </div>
            
            {passwordSuccess && (
              <div className="bg-green-600 text-white p-3 rounded-md mb-4 text-center">
                {passwordSuccess}
              </div>
            )}
            
            {passwordError && (
              <div className="bg-red-600 text-white p-3 rounded-md mb-4 text-center">
                {passwordError}
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-white text-sm mb-2">Senha Atual</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-purple-800 border border-purple-400 text-white focus:outline-none focus:border-purple-300"
                  placeholder="Digite sua senha atual"
                />
                <button
                  type="button"
                  className="absolute right-3 top-2 text-white"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-white text-sm mb-2">Nova Senha</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-purple-800 border border-purple-400 text-white focus:outline-none focus:border-purple-300"
                  placeholder="Digite a nova senha"
                />
                <button
                  type="button"
                  className="absolute right-3 top-2 text-white"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-white text-sm mb-2">Confirmar Nova Senha</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-purple-800 border border-purple-400 text-white focus:outline-none focus:border-purple-300"
                  placeholder="Confirme a nova senha"
                />
                <button
                  type="button"
                  className="absolute right-3 top-2 text-white"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </button>
              </div>
            </div>
            
            <button
              onClick={handlePasswordChange}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-500 transition-colors"
            >
              Alterar Senha
            </button>
          </div>
        </div>
      )}

      {/* MODAL - Deletar Conta */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-purple-900 border border-purple-400 p-8 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-red-500">Deletar Conta</h2>
              <button className="text-white hover:text-gray-300" onClick={resetDeleteModal}>
                <CloseIcon />
              </button>
            </div>
            
            <div className="mb-6 text-center">
              <DeleteIcon className="text-red-500 text-5xl mb-4" />
              <p className="text-white mb-4">
                Essa ação <span className="font-bold text-red-500">não pode ser desfeita</span>. 
                Todos os seus dados serão permanentemente removidos.
              </p>
              <p className="text-white mb-2">
                Para confirmar, digite <span className="font-bold">DELETAR</span> no campo abaixo:
              </p>
            </div>
            
            {deleteError && (
              <div className="bg-red-600 text-white p-3 rounded-md mb-4 text-center">
                {deleteError}
              </div>
            )}
            
            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-purple-800 border border-purple-400 text-white focus:outline-none focus:border-purple-300 mb-4"
              placeholder="Digite DELETAR"
            />
            
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDeleteAccount}
                className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-500 transition-colors font-bold"
              >
                Confirmar Exclusão
              </button>
              <button
                onClick={resetDeleteModal}
                className="w-full bg-gray-600 text-white py-3 rounded-md hover:bg-gray-500 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL - Confirmação de Logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-purple-900 border border-purple-400 p-8 rounded-lg text-center shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-6">Você tem certeza que deseja encerrar a sessão?</h2>
            <button 
              onClick={handleLogout} 
              className="w-full py-3 rounded-md mb-4 bg-red-600 text-white hover:bg-red-500"
            >
              Sim, Encerrar
            </button>
            <button 
              onClick={() => setShowLogoutModal(false)} 
              className="w-full py-3 rounded-md bg-gray-600 text-white hover:bg-gray-500"
            >
              Não, Voltar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editarperfilaluno;
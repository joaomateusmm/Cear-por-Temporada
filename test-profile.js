// Teste simples para verificar se a atualização do perfil está funcionando
import { updateOwnerProfile } from "./src/lib/owner-actions.ts";

async function testeProfile() {
  try {
    const result = await updateOwnerProfile("aHutQwJ9Y2nPuF5vnx8zH", {
      fullName: "Teste",
      phone: "123456789",
      instagram: "https://instagram.com/test",
      website: null,
      profileImage:
        "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=",
    });

    console.log("Resultado do teste:", result);
  } catch (error) {
    console.error("Erro no teste:", error);
  }
}

testeProfile();

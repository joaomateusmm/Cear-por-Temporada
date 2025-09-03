"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { deleteProperty } from "@/lib/property-actions";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";

interface DeletePropertyButtonProps {
  propertyId: string;
  propertyTitle: string;
  onPropertyDeleted: () => void;
}

export function DeletePropertyButton({
  propertyId,
  propertyTitle,
  onPropertyDeleted,
}: DeletePropertyButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteProperty(propertyId);

      if (result.success) {
        toast.success(result.message);
        onPropertyDeleted();
      } else {
        toast.error("Erro ao excluir imóvel: " + result.error);
      }
    } catch (error) {
      console.error("Erro ao excluir imóvel:", error);
      toast.error("Erro inesperado ao excluir imóvel");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isDeleting}
          className="text-red-600 hover:text-red-700 disabled:opacity-50"
        >
          <Trash2 className="h-3 w-3" />
          {isDeleting && <span className="ml-1 text-xs">Excluindo...</span>}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Imóvel</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o imóvel{" "}
            <strong>&quot;{propertyTitle}&quot;</strong>?
            <br />
            <br />
            Esta ação é <strong>IRREVERSÍVEL</strong> e irá remover:
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Todas as fotos e imagens</li>
              <li>Todas as comodidades</li>
              <li>Todos os preços e taxas</li>
              <li>Localização e endereço</li>
              <li>Disponibilidade e calendário</li>
              <li>Todas as reservas</li>
              <li>Todos os dados do imóvel</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
            disabled={isDeleting}
          >
            {isDeleting ? "Excluindo..." : "Confirmar Exclusão"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

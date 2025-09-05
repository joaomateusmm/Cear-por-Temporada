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
          className="border-slate-600 bg-slate-800 text-red-400 hover:border-red-600 hover:bg-red-900/20 hover:text-red-300 disabled:opacity-50"
        >
          <Trash2 className="h-3 w-3" />
          {isDeleting && <span className="ml-1 text-xs">Excluindo...</span>}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="border-slate-700 bg-slate-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-slate-100">
            Excluir Imóvel
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-300">
            Tem certeza que deseja excluir o imóvel{" "}
            <strong className="text-slate-100">
              &quot;{propertyTitle}&quot;
            </strong>
            ?
            <br />
            <br />
            Esta ação é <strong className="text-red-400">IRREVERSÍVEL</strong> e
            irá remover:
            <ul className="mt-2 list-inside list-disc space-y-1 text-slate-400">
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
          <AlertDialogCancel className="border-slate-600 bg-slate-700 text-slate-200 hover:bg-slate-600">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 text-white hover:bg-red-700"
            disabled={isDeleting}
          >
            {isDeleting ? "Excluindo..." : "Confirmar Exclusão"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { deleteDish } from '@/actions/dish-actions';
import { useToast } from '@/components/ui/toast';

interface DeleteDishButtonProps {
  id: string;
}

export function DeleteDishButton({ id }: DeleteDishButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = () => {
    // Confirmación nativa antes de eliminar
    if (window.confirm('¿Estás seguro de eliminar este plato?')) {
      startTransition(async () => {
        try {
          const result = await deleteDish(id);
          
          if (result?.error) {
            toast(result.error || "No se pudo eliminar el plato.", "error");
          } else {
            toast("El plato ha sido eliminado correctamente.", "success");
            router.refresh();
          }
        } catch {
          toast("Ocurrió un error inesperado al intentar eliminar el plato.", "error");
        }
      });
    }
  };

  return (
    <Button 
      variant="destructive" 
      size="sm" 
      onClick={handleDelete}
      disabled={isPending}
    >
      {isPending ? 'Eliminando...' : 'Eliminar'}
    </Button>
  );
}

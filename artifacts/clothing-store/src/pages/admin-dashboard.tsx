import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { customFetch } from "@workspace/api-client-react";
import { Package, Plus, LogOut, ArrowLeft } from "lucide-react";

interface Category {
  id: number;
  name: string;
}

export default function AdminDashboard() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    imageUrl: "",
    categoryId: "",
    featured: false,
    inStock: true,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setLocation("/admin/login");
      return;
    }

    // Fetch categories for the select input
    customFetch<Category[]>("/api/categories")
      .then(setCategories)
      .catch((err: unknown) => console.error("Error loading categories", err));
  }, [setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("admin_token");
      await customFetch("/api/products", {
        method: "POST",
        headers: {
          "x-admin-token": token || "",
        },
        body: JSON.stringify({
          ...formData,
          price: formData.price,
          originalPrice: formData.originalPrice || null,
          categoryId: parseInt(formData.categoryId),
          images: [formData.imageUrl], // For now, use the same URL for images array
        }),
      });

      toast({
        title: "Produto publicado!",
        description: "A nova peça já está disponível na loja.",
      });

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        originalPrice: "",
        imageUrl: "",
        categoryId: "",
        featured: false,
        inStock: true,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao publicar",
        description: "Não foi possível cadastrar o produto.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    toast({ title: "Logout realizado" });
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900">Painel Administrativo</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => setLocation("/")} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Ver Loja
            </Button>
            <Button variant="destructive" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" /> Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-indigo-600" />
              <CardTitle>Publicar Nova Roupa</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do Produto</Label>
                    <Input
                      id="name"
                      placeholder="Ex: Vestido Floral de Verão"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Preço (R$)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="99.90"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select
                      value={formData.categoryId}
                      onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Media and Details */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">URL da Imagem</Label>
                    <Input
                      id="imageUrl"
                      placeholder="https://exemplo.com/imagem.jpg"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      required
                    />
                    {formData.imageUrl && (
                      <div className="mt-2 aspect-square w-24 rounded-md border border-slate-200 overflow-hidden bg-white">
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 py-2">
                    <Checkbox
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, featured: !!checked })}
                    />
                    <Label htmlFor="featured" className="cursor-pointer">Destaque na página inicial</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Detalhes sobre tecido, caimento e estilo..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-lg bg-indigo-600 hover:bg-indigo-700 shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? "Salvando..." : "Publicar Produto"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

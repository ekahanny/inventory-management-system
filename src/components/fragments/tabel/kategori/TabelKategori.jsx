import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import React, { useEffect, useRef, useState } from "react";
import CategoryService from "../../../../services/CategoryService";
import ProductService from "../../../../services/ProductService";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";

export default function TabelKategori() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({ name: "" });
  const toast = useRef(null);

  const fetchCategories = async () => {
    try {
      const response = await CategoryService.getCategories();
      const kategoriArray = response.KategoriProduk || [];
      const formattedCategories = kategoriArray.map((item) => ({
        name: item.nama,
        id: item._id,
        _id: item._id, // Pastikan _id tersedia untuk operasi edit
      }));
      setCategories(formattedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Gagal memuat data kategori",
        life: 3000,
      });
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await ProductService.getAllProducts();
      const productInStock = response.Produk.filter((p) => p.stok > 0);
      setProducts(productInStock);
    } catch (error) {
      console.error("Gagal mengambil produk: ", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Gagal memuat data produk",
        life: 3000,
      });
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const showProductsDialog = (category) => {
    setSelectedCategory(category);
    const filteredProducts = products.filter(
      (product) => product.kategori === category.id
    );
    setCategoryProducts(filteredProducts);
    setDialogVisible(true);
  };

  const hideProductsDialog = () => {
    setDialogVisible(false);
    setSelectedCategory(null);
    setCategoryProducts([]);
  };

  const hideCategoryDialog = () => {
    setCategoryDialog(false);
    setSubmitted(false);
    setCurrentCategory({ name: "" });
  };

  const openNew = () => {
    setCurrentCategory({ name: "" });
    setIsEditMode(false);
    setSubmitted(false);
    setCategoryDialog(true);
  };

  const openEdit = (category) => {
    setCurrentCategory({ ...category });
    setIsEditMode(true);
    setSubmitted(false);
    setCategoryDialog(true);
  };

  const getProductCount = (categoryId) => {
    return products.filter((product) => product.kategori === categoryId).length;
  };

  const productCountBodyTemplate = (rowData) => {
    const count = getProductCount(rowData.id);
    return (
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          showProductsDialog(rowData);
        }}
        className="text-blue-500 hover:text-blue-700 hover:underline"
      >
        {count} produk
      </a>
    );
  };

  const onInputChange = (e, name) => {
    const val = e.target.value;
    setCurrentCategory((prev) => ({ ...prev, [name]: val }));
  };

  const saveCategory = async () => {
    setSubmitted(true);

    if (!currentCategory.name) {
      toast.current.show({
        severity: "warn",
        summary: "Peringatan",
        detail: "Nama kategori harus diisi",
        life: 3000,
      });
      return;
    }

    try {
      const categoryData = {
        nama: currentCategory.name,
      };

      if (isEditMode) {
        // Update kategori
        const updatedCategory = await CategoryService.updateCategory(
          currentCategory._id,
          categoryData
        );

        setCategories(
          categories.map((cat) =>
            cat._id === currentCategory._id
              ? { ...cat, name: updatedCategory.nama }
              : cat
          )
        );

        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Kategori berhasil diperbarui",
          life: 3000,
        });
      } else {
        // Tambah kategori baru
        const newCategory = await CategoryService.addCategory(categoryData);
        setCategories([
          ...categories,
          {
            name: newCategory.nama,
            id: newCategory._id,
            _id: newCategory._id,
          },
        ]);

        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Kategori berhasil ditambahkan",
          life: 3000,
        });
      }

      hideCategoryDialog();
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      toast.current.show({
        severity: "error",
        summary: "Gagal",
        detail:
          error.response?.data?.message ||
          (isEditMode
            ? "Gagal memperbarui kategori"
            : "Gagal menambahkan kategori"),
        life: 3000,
      });
    } finally {
      setSubmitted(false);
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      await CategoryService.deleteCategory(categoryId);
      setCategories(categories.filter((cat) => cat._id !== categoryId));
      toast.current.show({
        severity: "success",
        summary: "Berhasil",
        detail: "Kategori berhasil dihapus",
        life: 3000,
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.current.show({
        severity: "error",
        summary: "Gagal",
        detail: error.response?.data?.message || "Gagal menghapus kategori",
        life: 3000,
      });
    }
  };

  const confirmDelete = (category) => {
    if (getProductCount(category.id) > 0) {
      toast.current.show({
        severity: "warn",
        summary: "Peringatan",
        detail: "Tidak bisa menghapus kategori yang memiliki produk",
        life: 3000,
      });
      return;
    }

    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus kategori ${category.name}?`
      )
    ) {
      deleteCategory(category._id);
    }
  };

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    "products.nama_produk": {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    status: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
  });

  const onGlobalFilterChange = (event) => {
    const value = event.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
  };

  const renderHeader = () => {
    const value = filters["global"] ? filters["global"].value : "";
    return (
      <div className="flex flex-wrap gap-2 align-items-center justify-content-between bg-slate-100 border border-slate-200">
        <h4 className="ml-4 my-3 text-2xl text-sky-700">Kategori Produk</h4>
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            type="search"
            value={value || ""}
            onInput={(e) => onGlobalFilterChange(e)}
            placeholder="Search..."
            className="mr-3 pl-5 pr-2 py-2 border border-slate-300"
          />
        </IconField>
      </div>
    );
  };

  const header = renderHeader();

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          label="Tambah"
          icon="pi pi-plus"
          className="bg-sky-600 text-white px-3 py-2"
          onClick={openNew}
        />
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex justify-center">
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          size="small"
          className="mr-2 bg-green-300"
          onClick={() => openEdit(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          className="bg-red-300"
          size="small"
          onClick={() => confirmDelete(rowData)}
        />
      </div>
    );
  };

  const categoryDialogFooter = (
    <React.Fragment>
      <Button
        label="Batal"
        icon="pi pi-times"
        outlined
        onClick={hideCategoryDialog}
      />
      <Button
        label={isEditMode ? "Update" : "Simpan"}
        icon="pi pi-check"
        className="bg-sky-600 text-white"
        onClick={saveCategory}
      />
    </React.Fragment>
  );

  return (
    <div>
      <Toast ref={toast} />

      <div className="card ml-1 my-3 rounded-lg shadow-lg ">
        <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

        <DataTable
          value={categories}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          pt={{
            paginator: {
              root: { className: "bg-gray-100 p-2" },
              pageButton: ({ context }) =>
                context.active
                  ? { className: "bg-sky-500 text-white font-bold" }
                  : { className: "text-gray-700 hover:bg-gray-200" },
            },
          }}
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} categories"
          filters={filters}
          onFilter={(e) => setFilters(e.filters)}
          header={header}
          tableClassName="border border-slate-300"
          tableStyle={{ maxWidth: "100%" }}
          emptyMessage="Tidak ada data ditemukan."
        >
          <Column
            field="name"
            header="Nama Kategori"
            sortable
            style={{ minWidth: "12rem" }}
            className="border border-slate-300"
            headerClassName="border border-slate-300"
          ></Column>
          <Column
            header="Jumlah Produk"
            body={productCountBodyTemplate}
            sortable
            style={{ minWidth: "8rem" }}
            className="border border-slate-300"
            headerClassName="border border-slate-300"
          ></Column>
          <Column
            header="Action"
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "5rem" }}
            className="border border-slate-300"
            headerClassName="border border-slate-300"
          ></Column>
        </DataTable>
      </div>

      {/* Dialog tambah/edit kategori */}
      <Dialog
        visible={categoryDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={isEditMode ? "Edit Kategori" : "Tambah Kategori"}
        modal
        className="p-fluid"
        footer={categoryDialogFooter}
        onHide={hideCategoryDialog}
      >
        <div className="field">
          <label htmlFor="name" className="font-bold">
            Nama Kategori
          </label>
          <InputText
            id="name"
            value={currentCategory.name}
            onChange={(e) => onInputChange(e, "name")}
            required
            autoFocus
            className={classNames("border border-slate-400 rounded-md p-2", {
              "p-invalid border-red-500": submitted && !currentCategory.name,
            })}
          />
          {submitted && !currentCategory.name && (
            <small className="p-error">Nama kategori harus diisi</small>
          )}
        </div>
      </Dialog>

      {/* Dialog daftar produk dalam kategori */}
      <Dialog
        visible={dialogVisible}
        style={{ width: "50vw" }}
        header={`Produk dalam kategori ${selectedCategory?.name || ""}`}
        modal
        className="p-fluid"
        onHide={hideProductsDialog}
      >
        <DataTable
          value={categoryProducts}
          emptyMessage="Tidak ada produk dalam kategori ini"
          className="border border-slate-300"
        >
          <Column
            field="nama_produk"
            header="Nama Produk"
            className="border border-slate-300"
            headerClassName="border border-slate-300"
          />
          <Column
            field="kode_produk"
            header="Kode Produk"
            className="border border-slate-300"
            headerClassName="border border-slate-300"
          />
          <Column
            field="harga"
            header="Harga"
            className="border border-slate-300"
            headerClassName="border border-slate-300"
            body={(rowData) =>
              new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(rowData.harga)
            }
          />
          <Column
            field="stok"
            header="Stok"
            className="border border-slate-300"
            headerClassName="border border-slate-300"
          />
        </DataTable>
      </Dialog>
    </div>
  );
}

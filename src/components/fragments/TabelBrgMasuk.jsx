import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import CategoryService from "../../services/CategoryService";
import InProdService from "../../services/InProdService";

export default function TabelBrgMasuk() {
  let emptyProduct = {
    kode_produk: "",
    nama_produk: "",
    tanggal: "",
    kategori: "",
    harga: 0,
    stok: 0,
    isProdukMasuk: true,
  };

  const [products, setProducts] = useState(null);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  const fetchProducts = async () => {
    try {
      const response = await InProdService.getProducts();
      const productList = response.LogProduk || [];
      const products = productList.map((item) => ({
        _id: item._id,
        kode_produk: item.produk ? item.produk.kode_produk : "N/A",
        nama_produk: item.produk ? item.produk.nama_produk : "N/A",
        tanggal: item.tanggal,
        kategori: item.kategori,
        harga: item.harga,
        stok: item.stok,
      }));
      console.log(response.LogProduk);
      setProducts(products);
    } catch (error) {
      console.error("Gagal mengambil produk:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await CategoryService.getCategories();
      const kategoriArray = response.KategoriProduk || [];
      const formattedCategories = kategoriArray.map((item) => ({
        name: item.nama,
        id: item._id,
      }));
      setCategories(formattedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const formatCurrency = (value) => {
    return value.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const openNew = () => {
    setProduct(emptyProduct);
    setSelectedCategory(null);
    setSubmitted(false);
    setIsEditMode(false);
    setProductDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
  };

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  };

  const saveProduct = async () => {
    setSubmitted(true);

    if (
      !product.kode_produk ||
      !product.nama_produk.trim() ||
      !selectedCategory ||
      !product.tanggal ||
      !product.harga ||
      !product.stok
    ) {
      setSubmitted(true); // Dijalankan jika ada error
      toast.current.show({
        severity: "warn",
        summary: "Peringatan",
        detail: "Isi seluruh data terlebih dahulu!",
        life: 3000,
      });
      return;
    }
    setSubmitted(false); // Reset state submitted sebelum menyimpan data
    let newProduct = {
      kode_produk: product.kode_produk,
      nama_produk: product.nama_produk,
      tanggal: new Date(product.tanggal).toISOString(),
      kategori: selectedCategory.id,
      harga: product.harga,
      stok: product.stok || 0,
      isProdukMasuk: true,
    };

    try {
      const addedProduct = await InProdService.addProduct(newProduct);
      setProducts((prevProducts) => [...prevProducts, addedProduct]);

      toast.current.show({
        severity: "success",
        summary: "Berhasil",
        detail: "Produk berhasil ditambahkan",
        life: 3000,
      });
      setProductDialog(false);
      setProduct(emptyProduct);
      fetchProducts();
    } catch (error) {
      console.error(
        "Gagal menambahkan produk:",
        error.response?.data || error.message
      );
      toast.current.show({
        severity: "error",
        summary: "Gagal",
        detail: error.response?.data?.message || "Gagal menambahkan produk",
        life: 3000,
      });
    }
  };

  const editProduct = (product) => {
    setProduct({ ...product });
    setSubmitted(false);
    setIsEditMode(true);
    setProductDialog(true);
  };

  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
  };

  // const deleteProduct = () => {
  //   let _products = products.filter((val) => val.id !== product.id);

  //   setProducts(_products);
  //   setDeleteProductDialog(false);
  //   setProduct(emptyProduct);
  //   toast.current.show({
  //     severity: "success",
  //     summary: "Successful",
  //     detail: "Product Deleted",
  //     life: 3000,
  //   });
  // };

  const deleteProduct = async () => {
    try {
      await InProdService.deleteProduct(product._id); // Pastikan ini sesuai dengan API
      setProducts((prevProducts) =>
        prevProducts.filter((val) => val._id !== product._id)
      );

      setDeleteProductDialog(false);
      setProduct(products);
      toast.current.show({
        severity: "success",
        summary: "Berhasil",
        detail: "Produk berhasil dihapus",
        life: 3000,
      });
    } catch (error) {
      console.error("Gagal menghapus produk:", error);
    }
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const deleteSelectedProducts = () => {
    let _products = products.filter((val) => !selectedProducts.includes(val));

    setProducts(_products);
    setDeleteProductsDialog(false);
    setSelectedProducts(null);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Products Deleted",
      life: 3000,
    });
  };

  const onCategoryChange = (e) => {
    setSelectedCategory(e.value);
    setProduct((prev) => ({
      ...prev,
      kategori: e.value.nama_kategori,
    }));
    console.log(selectedCategory);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: val,
    }));
  };

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: val,
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          label="Tambah"
          icon="pi pi-plus"
          onClick={openNew}
          className="bg-sky-600 text-white px-3 py-2"
        />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <Button
        label="Export"
        icon="pi pi-upload"
        onClick={exportCSV}
        className="bg-sky-600 text-white px-3 py-2"
      />
    );
  };

  const priceBodyTemplate = (rowData) => {
    return formatCurrency(rowData.harga);
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.inventoryStatus}
        severity={getSeverity(rowData)}
      ></Tag>
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
          onClick={() => editProduct(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          // severity="danger"
          className="bg-red-300"
          onClick={() => confirmDeleteProduct(rowData)}
          size="small"
        />
      </div>
    );
  };

  const getSeverity = (product) => {
    switch (product.inventoryStatus) {
      case "INSTOCK":
        return "success";

      case "LOWSTOCK":
        return "warning";

      case "OUTOFSTOCK":
        return "danger";

      default:
        return null;
    }
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between bg-slate-100 border border-slate-200">
      <h4 className="ml-4 my-3 text-2xl text-sky-700">Barang Masuk</h4>
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
          className="mr-3 pl-5 py-2 border border-slate-300"
        />
      </IconField>
    </div>
  );

  const productDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        style={{ fontSize: "0.5rem" }}
        className="px-2 py-1.5 border-1 border-sky-400 text-sm text-sky-400 mr-2"
        onClick={hideDialog}
      />
      <Button
        label={isEditMode ? "Update" : "Save"}
        icon="pi pi-check"
        style={{ fontSize: "0.5rem" }}
        className="px-2.5 py-1.5 text-sm border-1 border-sky-400 text-white bg-sky-400"
        onClick={saveProduct}
      />
    </React.Fragment>
  );
  const deleteProductDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteProductDialog}
        className="px-2 py-1.5 border-1 border-sky-400 text-sm text-sky-400 mr-2"
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteProduct}
        className="px-2.5 py-1.5 text-sm border-1 border-red-400 text-white bg-red-400"
      />
    </React.Fragment>
  );
  const deleteProductsDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteProductsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteSelectedProducts}
      />
    </React.Fragment>
  );

  return (
    <div>
      <Toast ref={toast} />
      <div className="card ml-1 my-3 rounded-lg shadow-lg ">
        <Toolbar
          className="mb-4"
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        ></Toolbar>

        <DataTable
          ref={dt}
          value={products}
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
                  ? { className: "bg-sky-500 text-white font-bold" } // Halaman aktif
                  : { className: "text-gray-700 hover:bg-gray-200" }, // Halaman non-aktif
            },
          }}
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
          globalFilter={globalFilter}
          header={header}
          tableClassName="border border-slate-300"
          tableStyle={{ maxWidth: "100%" }}
        >
          {/* Header Kolom */}
          <Column
            field="kode_produk"
            header="Kode Produk"
            style={{ minWidth: "12rem" }}
            className="border border-slate-300 text-black"
            headerClassName="border border-slate-300 text-black"
          ></Column>
          <Column
            field="nama_produk"
            header="Nama Produk"
            sortable
            style={{ minWidth: "16rem" }}
            className="border border-slate-300"
            headerClassName="border border-slate-300"
          ></Column>
          <Column
            field="tanggal"
            header="Tanggal Masuk"
            body={(rowData) => formatDate(rowData.tanggal)}
            sortable
            style={{ minWidth: "10rem" }}
            className="border border-slate-300"
            headerClassName="border border-slate-300"
          ></Column>
          <Column
            field="harga"
            header="Harga"
            body={priceBodyTemplate}
            sortable
            style={{ minWidth: "8rem" }}
            className="border border-slate-300"
            headerClassName="border border-slate-300"
          ></Column>
          <Column
            field="stok"
            header="Stok (pcs)"
            // body={statusBodyTemplate}
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

      <Dialog
        visible={productDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={isEditMode ? "Edit Barang Masuk" : "Tambah Barang Masuk"}
        modal
        className="p-fluid"
        footer={productDialogFooter}
        onHide={hideDialog}
      >
        <div className="field">
          <label htmlFor="kode_produk" className="font-bold">
            Kode Produk
          </label>
          <InputText
            id="kode_produk"
            value={product.kode_produk}
            onChange={(e) => onInputChange(e, "kode_produk")}
            required
            autoFocus
            className={classNames("border border-slate-400 rounded-md p-2", {
              "p-invalid border-red-500": submitted && !product.kode_produk,
            })}
          />
          {submitted && !product.kode_produk && (
            <small className="p-error">Kode produk harus diisi</small>
          )}
        </div>

        <div className="field">
          <label htmlFor="nama_produk" className="font-bold">
            Nama Produk
          </label>
          <InputTextarea
            id="nama_produk"
            value={product.nama_produk}
            onChange={(e) => onInputChange(e, "nama_produk")}
            required
            rows={3}
            cols={15}
            className={classNames("border border-slate-400 rounded-md p-2", {
              "p-invalid border-red-500": submitted && !product.nama_produk,
            })}
          />
          {submitted && !product.nama_produk && (
            <small className="p-error">Nama produk harus diisi</small>
          )}
        </div>

        <div className="field">
          <label htmlFor="nama_produk" className="font-bold">
            Tanggal Masuk
          </label>
          <Calendar
            id="tanggal"
            inputClassName={classNames(
              "border border-slate-400 rounded-md p-2",
              {
                "p-invalid border-red-500": submitted && !product.tanggal,
              }
            )}
            className="bg-sky-300 rounded-md"
            value={product.tanggal}
            onChange={(e) => setProduct({ ...product, tanggal: e.value })}
            showIcon
            dateFormat="yy-mm-dd"
            required
          />
          {submitted && !product.tanggal && (
            <small className="p-error">Tanggal masuk harus diisi</small>
          )}
        </div>
        <div className="field">
          <label className=" font-bold">Kategori</label>
          <Dropdown
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.value)}
            options={categories}
            optionLabel="name"
            placeholder="Pilih Kategori"
            className={classNames("border border-slate-400 w-full", {
              "p-invalid border-red-500": submitted && !selectedCategory,
            })}
            required
          />
          {submitted && !selectedCategory && (
            <small className="p-error">Pilih kategori terlebih dahulu</small>
          )}
        </div>
        <div className="formgrid grid">
          <div className="field col">
            <label htmlFor="harga" className="font-bold">
              Harga
            </label>
            <InputNumber
              id="harga"
              value={product.harga}
              onChange={(e) => onInputNumberChange(e, "harga")}
              inputClassName={classNames(
                "border border-slate-400 p-2 rounded-md",
                {
                  "p-invalid border-red-500": submitted && !product.harga,
                }
              )}
            />
            {submitted && !product.harga && (
              <small className="p-error">Harga harus diisi</small>
            )}
          </div>
          <div className="field col">
            <label htmlFor="stok" className="font-bold">
              Stok Masuk
            </label>
            <InputNumber
              id="stok"
              value={product.stok}
              onChange={(e) => onInputNumberChange(e, "stok")}
              inputClassName={classNames(
                "border border-slate-400 p-2 rounded-md",
                {
                  "p-invalid border-red-500": submitted && !product.stok,
                }
              )}
            />
            {submitted && !product.stok && (
              <small className="p-error">Stok masuk harus diisi</small>
            )}
          </div>
        </div>
      </Dialog>

      <Dialog
        visible={deleteProductDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Konfirmasi Penghapusan"
        modal
        footer={deleteProductDialogFooter}
        onHide={hideDeleteProductDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "1.5rem" }}
          />
          {product && (
            <span>
              Apakah anda yakin ingin menghapus <b>{product.nama_produk}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}

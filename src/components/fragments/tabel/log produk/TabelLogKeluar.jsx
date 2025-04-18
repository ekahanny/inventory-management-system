import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import CategoryService from "../../../../services/CategoryService";
import InLogProdService from "../../../../services/InLogProdService";
import ProductService from "../../../../services/ProductService";
import * as XLSX from "xlsx";
import { FilterMatchMode, FilterOperator } from "primereact/api";

export default function TabelLogKeluar() {
  let emptyProduct = {
    kode_produk: "",
    nama_produk: "",
    tanggal: "",
    kategori: "",
    harga: 0,
    stok: 0,
    isProdukMasuk: false,
  };

  const [products, setProducts] = useState([]); // products log
  const [product, setProduct] = useState(emptyProduct); // product log
  const [productList, setProductList] = useState([]); // product
  const [productDialog, setProductDialog] = useState(false);
  const [deleteLogProductDialog, setdeleteLogProductDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const toast = useRef(null);
  const dt = useRef(null);

  const fetchLogProducts = async () => {
    try {
      const response = await InLogProdService.getLogProducts();
      const productList =
        response.LogProduk.filter((item) => item.isProdukMasuk === false) || [];
      const products = productList.map((item) => ({
        _id: item._id,
        kode_produk: item.produk ? item.produk.kode_produk : "N/A",
        nama_produk: item.produk ? item.produk.nama_produk : "N/A",
        kategori: item.produk ? item.produk.kategori : "Unknown",
        tanggal: item.tanggal,
        harga: item.harga,
        stok: item.stok,
      }));
      console.log("Response dari API Log Produk : ", response.LogProduk);
      setProducts(products);
    } catch (error) {
      console.error("Gagal mengambil log produk:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const response = await ProductService.getProducts();
      const productInStock = response.Produk.filter((p) => p.stok > 0);
      setProductList(productInStock);
    } catch (error) {
      console.error("Gagal mengambil produk: ", error);
    } finally {
      setIsLoadingProducts(false);
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
    fetchLogProducts();
    fetchCategories();
    fetchProducts();
  }, []);

  const formatCurrency = (value) => {
    return (value || 0).toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const openNew = () => {
    fetchProducts();
    setProduct({ ...emptyProduct });
    setSubmitted(false);
    setIsEditMode(false);
    setProductDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
  };

  const hidedeleteLogProductDialog = () => {
    setdeleteLogProductDialog(false);
  };

  const saveProduct = async () => {
    setSubmitted(true);

    const selectedProduct = productList.find(
      (p) => p.kode_produk === product.kode_produk
    );

    // Validasi stok
    if (selectedProduct && product.stok > selectedProduct.stok) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Stok keluar melebihi stok yang tersedia (${selectedProduct.stok})`,
        life: 3000,
      });
      return;
    }

    try {
      const formattedDate = new Date(product.tanggal);
      formattedDate.setHours(formattedDate.getHours() + 8);

      const productData = {
        kode_produk: product.kode_produk,
        nama_produk: product.nama_produk,
        tanggal: formattedDate.toISOString(),
        kategori: product.kategori,
        harga: product.harga,
        stok: product.stok,
        isProdukMasuk: false,
      };

      if (isEditMode) {
        await InLogProdService.updateLogProduct(product._id, productData);
      } else {
        await InLogProdService.addLogProduct(productData);

        // Update stok di local state -> option dropdown
        setProductList((prevList) =>
          prevList.map((item) =>
            item.kode_produk === product.kode_produk
              ? { ...item, stok: item.stok - product.stok }
              : item
          )
        );
      }

      toast.current.show({
        severity: "success",
        summary: "Berhasil",
        detail: `Produk berhasil ${isEditMode ? "diperbarui" : "ditambahkan"}`,
        life: 3000,
      });

      setProductDialog(false);
      setProduct(emptyProduct);
      fetchLogProducts();
    } catch (error) {
      console.error("Error:", error);
      toast.current.show({
        severity: "error",
        summary: "Gagal",
        detail: error.response?.data?.message || "Terjadi kesalahan",
        life: 3000,
      });
    } finally {
      setSubmitted(false);
    }
  };

  const editProduct = (product) => {
    setProduct({
      ...product,
      tanggal: new Date(product.tanggal),
      kategori: product.kategori?.id || product.kategori,
    });
    console.log("product diedit: ", product);

    setSubmitted(false);
    setIsEditMode(true);
    setProductDialog(true);
  };

  const confirmdeleteLogProduct = (product) => {
    setProduct(product);
    setdeleteLogProductDialog(true);
  };

  const deleteLogProduct = async () => {
    try {
      await InLogProdService.deleteLogProduct(product._id);
      setProducts((prevProducts) =>
        prevProducts.filter((val) => val._id !== product._id)
      );

      setdeleteLogProductDialog(false);
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

  const exportExcel = () => {
    // Format data untuk Excel (hanya kolom yang ditampilkan di DataTable)
    const excelData = products
      .filter((product) => product.isProdukMasuk === false)
      .map((product) => ({
        "Kode Produk": product.kode_produk,
        "Nama Produk": product.nama_produk,
        Kategori:
          categories.find((cat) => cat.id === product.kategori)?.name ||
          product.kategori,
        "Tanggal Keluar": formatDate(product.tanggal),
        Harga: formatCurrency(product.harga),
        "Stok (pcs)": product.stok,
      }));

    // Buat worksheet dari data
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Buat workbook dan tambahkan worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Barang Keluar");

    // Export ke file Excel (.xlsx)
    XLSX.writeFile(wb, "Data_Barang_Keluar.xlsx");
  };

  const onProductCodeChange = (e) => {
    fetchProducts();
    const selectedCode = e.value;
    const selectedProduct = productList.find(
      (p) => p.kode_produk === selectedCode
    );

    setProduct((prev) => ({
      ...prev,
      kode_produk: selectedCode,
      nama_produk: selectedProduct?.nama_produk || "",
      kategori: selectedProduct?.kategori || "",
      harga: selectedProduct?.harga || prev.harga, // Isi harga otomatis
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
        onClick={exportExcel}
        className="bg-sky-600 text-white px-3 py-2"
      />
    );
  };

  const priceBodyTemplate = (rowData) => {
    return formatCurrency(rowData?.harga);
  };

  const categoryBodyTemplate = (rowData) => {
    const category = categories.find((cat) => {
      return cat.id === rowData.kategori;
    });
    return category ? category.name : "Unknown";
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
          className="bg-red-300"
          onClick={() => confirmdeleteLogProduct(rowData)}
          size="small"
        />
      </div>
    );
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
        <h4 className="ml-4 my-3 text-2xl text-sky-700">Barang Keluar</h4>
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
  const deleteLogProductDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hidedeleteLogProductDialog}
        className="px-2 py-1.5 border-1 border-sky-400 text-sm text-sky-400 mr-2"
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteLogProduct}
        className="px-2.5 py-1.5 text-sm border-1 border-red-400 text-white bg-red-400"
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
          filters={filters}
          onFilter={(e) => setFilters(e.filters)}
          header={header}
          tableClassName="border border-slate-300"
          tableStyle={{ maxWidth: "100%" }}
          emptyMessage="Tidak ada data ditemukan."
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
            field="kategori"
            header="Kategori"
            body={categoryBodyTemplate}
            style={{ minWidth: "8rem" }}
            className="border border-slate-300"
            headerClassName="border border-slate-300"
          ></Column>
          <Column
            field="tanggal"
            header="Tanggal Keluar"
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
        header={isEditMode ? "Edit Barang Keluar" : "Tambah Barang Keluar"}
        modal
        className="p-fluid"
        footer={productDialogFooter}
        onHide={hideDialog}
      >
        <div className="field">
          <label htmlFor="kode_produk" className="font-bold">
            Kode Produk
          </label>
          <Dropdown
            value={product.kode_produk}
            onChange={onProductCodeChange}
            options={
              isLoadingProducts
                ? [{ label: "Memuat data...", value: null }]
                : productList?.map((p) => ({
                    label: `${p.kode_produk} - ${p.nama_produk} (Stok: ${p.stok})`,
                    value: p.kode_produk,
                  }))
            }
            filter
            showClear
            optionLabel="label"
            placeholder={isLoadingProducts ? "Memuat..." : "Pilih Produk..."}
            disabled={isLoadingProducts}
            className={classNames("border border-slate-400 w-full", {
              "p-invalid": submitted && !product.kode_produk,
            })}
          />
        </div>

        <div className="field">
          <label htmlFor="tanggal" className="font-bold">
            Tanggal Keluar
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
            dateFormat="dd-mm-yy"
            required
          />
          {submitted && !product.tanggal && (
            <small className="p-error">Tanggal keluar harus diisi</small>
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
              Stok Keluar
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
              <small className="p-error">Stok keluar harus diisi</small>
            )}
          </div>
        </div>
      </Dialog>

      <Dialog
        visible={deleteLogProductDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Konfirmasi Penghapusan"
        modal
        footer={deleteLogProductDialogFooter}
        onHide={hidedeleteLogProductDialog}
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

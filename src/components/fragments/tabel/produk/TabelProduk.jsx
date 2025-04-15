import React, { useState, useEffect, useRef } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Tag } from "primereact/tag";
import ProductService from "../../../../services/ProductService";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
import { InputNumber } from "primereact/inputnumber";

export default function TabelProduk() {
  let emptyProduct = {
    _id: "",
    kode_produk: "",
    nama_produk: "",
    stok: 0,
  };

  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(emptyProduct); // product log
  const [submitted, setSubmitted] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const toast = useRef(null);

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

  const fetchProducts = async () => {
    try {
      const response = await ProductService.getProducts();
      const productList = response.Produk || [];
      const products = productList.map((item) => ({
        _id: item._id,
        kode_produk: item ? item.kode_produk : "N/A",
        nama_produk: item ? item.nama_produk : "N/A",
        stok: item.stok,
      }));
      console.log("Response API Produk: ", productList);
      setProducts(products);
    } catch (error) {
      console.error("Gagal mengambil produk: ", error);
    }
  };

  const editProduct = (product) => {
    setProduct({ ...product });
    setIsEditMode(true);
    setProductDialog(true);
  };

  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
  };

  const deleteProduct = async () => {
    try {
      await ProductService.deleteProduct(product._id);
      setDeleteProductDialog(false);
      Toast.current.show({
        severity: "success",
        summary: "Berhasil",
        detail: "Produk berhasil dihapus",
        life: 3000,
      });
      fetchProducts();
    } catch (error) {
      console.error("Gagal menghapus produk: ", error);
      toast.current.show({
        severity: "error",
        summary: "Gagal",
        detail: "Gagal menghapus produk",
        life: 3000,
      });
    }
  };

  const saveProduct = async () => {
    try {
      if (isEditMode) {
        await ProductService.updateProduct(product._id, product);
        Toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Produk berhasil diperbaharui",
          life: 3000,
        });
      } else {
        await ProductService.addProduct(product);
        Toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Produk berhasil ditambahkan",
          life: 3000,
        });
      }
      setProductDialog(false);
      fetchProducts();
    } catch (error) {
      console.error(
        isEditMode ? "Gagal mengupdate produk:" : "Gagal menambahkan produk:",
        error.response?.data || error.message
      );

      toast.current.show({
        severity: "error",
        summary: "Gagal",
        detail:
          error.response?.data?.message ||
          (isEditMode ? "Gagal mengupdate produk" : "Gagal menambahkan produk"),
        life: 3000,
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getSeverity = (stok) => {
    switch (true) {
      case stok <= 10:
        return "danger";
      case stok <= 50:
        return "warning";
      default:
        return "success";
    }
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
          onClick={() => confirmDeleteProduct(rowData)}
          size="small"
        />
      </div>
    );
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <div className="flex justify-center">
        <Tag
          value={rowData.stok}
          severity={getSeverity(rowData.stok)}
          style={{ fontSize: "1rem" }}
        />
      </div>
    );
  };

  const onGlobalFilterChange = (event) => {
    const value = event.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
  };

  const renderHeader = () => {
    const value = filters["global"] ? filters["global"].value : "";

    return (
      <div className="flex justify-between items-center">
        <Button
          label="Tambah"
          icon="pi pi-plus"
          className="p-button-sm bg-sky-600 text-white px-3 py-2 hover:bg-blue-700 mx-1.5"
          onClick={() => {
            setProduct(emptyProduct);
            setIsEditMode(false);
            setProductDialog(true);
          }}
        />
        <IconField iconPosition="left" className="border border-slate-400 w-96">
          <InputIcon className="pi pi-search ml-2" />
          <InputText
            type="search"
            value={value || ""}
            onChange={(e) => onGlobalFilterChange(e)}
            placeholder="Search"
            className="p-inputtext-sm w-full mr-3 pl-6 pr-2 py-1.5 border border-slate-300"
          />
        </IconField>
      </div>
    );
  };

  const productDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        outlined
        onClick={() => setProductDialog(false)}
        className="px-2 py-1.5 border-1 border-sky-400 text-sm text-sky-400 mr-2"
      />
      <Button
        label="Save"
        icon="pi pi-check"
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
        onClick={() => setDeleteProductDialog(false)}
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

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _product = { ...product };
    _product[`${name}`] = val;
    setProduct(_product);
  };

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: val,
    }));
  };

  const header = renderHeader();

  return (
    <div className="card ml-1 mt-5 rounded-lg shadow-lg">
      <Toast ref={toast} />
      <DataTable
        value={products}
        dataKey="id"
        paginator
        rows={5}
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
        header={header}
        tableClassName="border border-slate-300"
        tableStyle={{ minWidth: "50rem" }}
        onFilter={(e) => setFilters(e.filters)}
        stateStorage="session"
        stateKey="dt-state-demo-local"
        emptyMessage="Tidak ada data ditemukan."
        // selectionMode="single"
      >
        <Column
          field="kode_produk"
          header="Kode Produk"
          style={{ width: "20%" }}
          className="border border-slate-300"
          headerClassName="border border-slate-300"
        ></Column>
        <Column
          field="nama_produk"
          header="Nama Produk"
          sortable
          style={{ width: "25%" }}
          className="border border-slate-300"
          headerClassName="border border-gray-300"
        ></Column>
        <Column
          field="stok"
          header="Stok Produk"
          body={statusBodyTemplate}
          sortable
          style={{ width: "10%" }}
          className="border border-slate-300"
          headerClassName="border border-gray-300"
        ></Column>
        <Column
          header="Action"
          body={actionBodyTemplate}
          exportable={false}
          style={{ width: "15%" }}
          className="border border-slate-300"
          headerClassName="border border-slate-300"
        ></Column>
      </DataTable>

      <Dialog
        visible={productDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={isEditMode ? "Edit Produk" : "Tambah Produk"}
        modal
        className="p-fluid"
        footer={productDialogFooter}
        onHide={() => setProductDialog(false)}
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
            placeholder="Isi Kode Produk..."
          />
          {submitted && !product.kode_produk && (
            <small className="p-error">Kode produk harus diisi.</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="nama_produk" className="font-bold">
            Nama Produk
          </label>
          <InputText
            id="nama_produk"
            value={product.nama_produk}
            onChange={(e) => onInputChange(e, "nama_produk")}
            required
            className={classNames("border border-slate-400 rounded-md p-2", {
              "p-invalid border-red-500": submitted && !product.nama_produk,
            })}
            placeholder="Isi Nama Produk..."
          />
          {submitted && !product.nama_produk && (
            <small className="p-error">Nama produk harus diisi.</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="stok" className="font-bold">
            Stok
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
      </Dialog>

      <Dialog
        visible={deleteProductDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteProductDialogFooter}
        onHide={() => setDeleteProductDialog(false)}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {product && (
            <span>
              Apakah Anda yakin ingin menghapus <b>{product.nama_produk}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}

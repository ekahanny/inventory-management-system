import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProductService } from "../../services/ProductService";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { Dropdown } from "primereact/dropdown";

export default function ProductsDemo() {
  let emptyProduct = {
    id: null,
    name: "",
    image: null,
    description: "",
    category: null,
    harga: 0,
    quantity: 0,
    rating: 0,
    inventoryStatus: "INSTOCK",
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
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    ProductService.getProducts().then((data) => setProducts(data));
  }, []);

  const formatCurrency = (value) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const openNew = () => {
    setProduct(emptyProduct);
    setSubmitted(false);
    setProductDialog(true);
    // isEditMode(false);
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

  const saveProduct = () => {
    setSubmitted(true);

    if (product.name.trim()) {
      let _products = [...products];
      let _product = { ...product };

      if (product.id) {
        const index = findIndexById(product.id);

        _products[index] = _product;
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Updated",
          life: 3000,
        });
      } else {
        _product.id = createId();
        _product.image = "product-placeholder.svg";
        _products.push(_product);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Created",
          life: 3000,
        });
      }

      setProducts(_products);
      setProductDialog(false);
      setProduct(emptyProduct);
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

  const deleteProduct = () => {
    let _products = products.filter((val) => val.id !== product.id);

    setProducts(_products);
    setDeleteProductDialog(false);
    setProduct(emptyProduct);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Product Deleted",
      life: 3000,
    });
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < products.length; i++) {
      if (products[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const createId = () => {
    let id = "";
    let chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return id;
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
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
    let _product = { ...product };

    _product["category"] = e.value;
    setProduct(_product);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _product = { ...product };

    _product[`${name}`] = val;

    setProduct(_product);
  };

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _product = { ...product };

    _product[`${name}`] = val;

    setProduct(_product);
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

  // const imageBodyTemplate = (rowData) => {
  //   return (
  //     <img
  //       src={`https://primefaces.org/cdn/primereact/images/product/${rowData.image}`}
  //       alt={rowData.image}
  //       className="shadow-2 border-round"
  //       style={{ width: "64px" }}
  //     />
  //   );
  // };

  const priceBodyTemplate = (rowData) => {
    return formatCurrency(rowData.harga);
  };

  const ratingBodyTemplate = (rowData) => {
    return <Rating value={rowData.rating} readOnly cancel={false} />;
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

  const [selectedCity, setSelectedCity] = useState(null);
  const cities = [
    { name: "New York", code: "NY" },
    { name: "Rome", code: "RM" },
    { name: "London", code: "LDN" },
    { name: "Istanbul", code: "IST" },
    { name: "Paris", code: "PRS" },
  ];

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
      <div className="card ml-1 mt-5 rounded-lg shadow-lg ">
        <Toolbar
          className="mb-4"
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        ></Toolbar>

        <DataTable
          ref={dt}
          value={products}
          // selection={selectedProducts}
          // onSelectionChange={(e) => setSelectedProducts(e.value)}
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
          // className="border border-slate-300 px-3"
          tableClassName="border border-slate-300"
          tableStyle={{ maxWidth: "100%" }}
        >
          {/* Header Kolom */}
          <Column
            field="kode_produk"
            header="Kode Produk"
            style={{ minWidth: "12rem" }}
            className="border border-slate-300"
            headerClassName="border border-slate-300"
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
            field="harga"
            header="Harga"
            body={priceBodyTemplate}
            sortable
            style={{ minWidth: "8rem" }}
            className="border border-slate-300"
            headerClassName="border border-slate-300"
          ></Column>
          {/* <Column
            field="jenis_satuan"
            header="Jenis Satuan"
            style={{ minWidth: "10rem" }}
            className="border border-slate-300"
            headerClassName="border border-slate-300"
          ></Column> */}
          <Column
            field="tanggal_masuk"
            header="Tanggal Masuk"
            // body={ratingBodyTemplate}
            sortable
            style={{ minWidth: "10rem" }}
            className="border border-slate-300"
            headerClassName="border border-slate-300"
          ></Column>
          <Column
            field="stok_masuk"
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
            <small className="p-error">Product code is required.</small>
          )}
        </div>

        <div className="field">
          <label htmlFor="name" className="font-bold">
            Nama Produk
          </label>
          <InputTextarea
            id="name"
            value={product.name}
            onChange={(e) => onInputChange(e, "name")}
            required
            rows={3}
            cols={15}
            className={classNames("border border-slate-400 rounded-md p-2", {
              "p-invalid border-red-500": submitted && !product.name,
            })}
          />
          {submitted && !product.name && (
            <small className="p-error">Name is required.</small>
          )}
        </div>

        <div className="field">
          <label className=" font-bold">Kategori</label>
          <Dropdown
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.value)}
            options={cities}
            optionLabel="name"
            placeholder="Pilih Kategori"
            className="w-full border border-slate-400"
            showClear
            required
          />
        </div>

        <div className="formgrid grid">
          <div className="field col">
            <label htmlFor="harga" className="font-bold">
              Harga
            </label>
            <InputNumber
              id="harga"
              value={product.harga}
              onValueChange={(e) => onInputNumberChange(e, "harga")}
              // mode="currency"
              // currency="USD"
              // locale="en-US"
              inputClassName="p-2 border border-slate-400 rounded-md"
            />
          </div>
          <div className="field col">
            <label htmlFor="stok" className="font-bold">
              Stok Masuk
            </label>
            <InputNumber
              id="stok"
              value={product.stok}
              onValueChange={(e) => onInputNumberChange(e, "stok")}
              inputClassName="p-2 border border-slate-400 rounded-md"
            />
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
              Apakah anda yakin ingin menghapus <b>{product.name}</b>?
            </span>
          )}
        </div>
      </Dialog>

      {/* <Dialog
        visible={deleteProductsDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteProductsDialogFooter}
        onHide={hideDeleteProductsDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {product && (
            <span>Are you sure you want to delete the selected products?</span>
          )}
        </div>
      </Dialog> */}
    </div>
  );
}

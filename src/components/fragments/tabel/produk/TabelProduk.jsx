import React, { useState, useEffect } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Tag } from "primereact/tag";
import ProductService from "../../../../services/ProductService";
import { Button } from "primereact/button";

export default function TabelProduk() {
  const [products, setProducts] = useState([]);

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
          // onClick={() => editProduct(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          className="bg-red-300"
          // onClick={() => confirmdeleteLogProduct(rowData)}
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
      <IconField iconPosition="left" className="border border-slate-400">
        <InputIcon className="pi pi-search ml-2" />
        <InputText
          type="search"
          value={value || ""}
          onChange={(e) => onGlobalFilterChange(e)}
          placeholder="Search"
          className="p-inputtext-sm w-full mr-3 pl-6 pr-2 py-1.5 border border-slate-300"
        />
      </IconField>
    );
  };

  const header = renderHeader();

  return (
    <div className="card ml-1 mt-5 rounded-lg shadow-lg">
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
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { CustomerService } from "../../../../services/CustomerService";

export default function TabelProduk() {
  const [customers, setCustomers] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    "country.name": {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    status: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
  });

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const representatives = [
    { name: "Amy Elsner", image: "amyelsner.png" },
    { name: "Anna Fali", image: "annafali.png" },
    { name: "Asiya Javayant", image: "asiyajavayant.png" },
    { name: "Bernardo Dominic", image: "bernardodominic.png" },
    { name: "Elwin Sharvill", image: "elwinsharvill.png" },
    { name: "Ioni Bowcher", image: "ionibowcher.png" },
    { name: "Ivan Magalhaes", image: "ivanmagalhaes.png" },
    { name: "Onyama Limba", image: "onyamalimba.png" },
    { name: "Stephen Shaw", image: "stephenshaw.png" },
    { name: "XuXue Feng", image: "xuxuefeng.png" },
  ];
  const statuses = [
    "unqualified",
    "qualified",
    "new",
    "negotiation",
    "renewal",
  ];

  const getSeverity = (status) => {
    switch (status) {
      case "unqualified":
        return "danger";

      case "qualified":
        return "success";

      case "new":
        return "info";

      case "negotiation":
        return "warning";

      case "renewal":
        return null;
    }
  };

  useEffect(() => {
    CustomerService.getCustomersSmall().then((data) => setCustomers(data));
  }, []);

  const countryBodyTemplate = (rowData) => {
    return (
      <div className="flex align-items-center gap-2">
        <img
          alt={rowData.country.code}
          src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png"
          className={`flag flag-${rowData.country.code}`}
          style={{ width: "24px" }}
        />
        <span>{rowData.country.name}</span>
      </div>
    );
  };

  const representativeBodyTemplate = (rowData) => {
    const representative = rowData.representative;

    return (
      <div className="flex align-items-center gap-2">
        <img
          alt={representative.name}
          src={`https://primefaces.org/cdn/primereact/images/avatar/${representative.image}`}
          width="32"
        />
        <span>{representative.name}</span>
      </div>
    );
  };

  const representativeFilterTemplate = (options) => {
    return (
      <MultiSelect
        value={options.value}
        options={representatives}
        itemTemplate={representativesItemTemplate}
        onChange={(e) => options.filterCallback(e.value)}
        optionLabel="name"
        placeholder="Any"
        className="p-column-filter"
      />
    );
  };

  const representativesItemTemplate = (option) => {
    return (
      <div className="flex align-items-center gap-2">
        <img
          alt={option.name}
          src={`https://primefaces.org/cdn/primereact/images/avatar/${option.image}`}
          width="32"
        />
        <span>{option.name}</span>
      </div>
    );
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag value={rowData.status} severity={getSeverity(rowData.status)} />
    );
  };

  const statusFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        itemTemplate={statusItemTemplate}
        placeholder="Select One"
        className="p-column-filter"
        showClear
      />
    );
  };

  const statusItemTemplate = (option) => {
    return <Tag value={option} severity={getSeverity(option)} />;
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
          className="p-inputtext-sm ml-5 p-3 border-none"
        />
      </IconField>
    );
  };

  const header = renderHeader();

  return (
    <div className="card ml-1 mt-5 rounded-lg shadow-lg">
      <DataTable
        value={customers}
        paginator
        rows={5}
        header={header}
        filters={filters}
        onFilter={(e) => setFilters(e.filters)}
        selection={selectedCustomer}
        onSelectionChange={(e) => setSelectedCustomer(e.value)}
        selectionMode="single"
        dataKey="id"
        stateStorage="session"
        stateKey="dt-state-demo-local"
        emptyMessage="No customers found."
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column
          field="name"
          header="Kode Produk"
          style={{ width: "25%" }}
          className="border border-slate-300"
          headerClassName="border border-slate-300"
        ></Column>
        <Column
          header="Nama Produk"
          body={countryBodyTemplate}
          sortable
          sortField="country.name"
          style={{ width: "25%" }}
          className="border border-slate-300"
          headerClassName="border border-gray-300"
        ></Column>
        {/* <Column
          header="Agent"
          body={representativeBodyTemplate}
          sortable
          sortField="representative.name"
          filter
          filterField="representative"
          showFilterMatchModes={false}
          filterElement={representativeFilterTemplate}
          filterMenuStyle={{ width: "14rem" }}
          style={{ width: "25%" }}
          className="border border-slate-300"
          headerClassName="border border-gray-300"
        ></Column> */}
        <Column
          field="status"
          header="Stok Produk"
          body={statusBodyTemplate}
          sortable
          style={{ width: "25%" }}
          className="border border-slate-300"
          headerClassName="border border-gray-300"
        ></Column>
      </DataTable>
    </div>
  );
}

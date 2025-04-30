import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ProductService from "../services/ProductService";
import InLogProdService from "../services/InLogProdService";
import SidebarComponent from "../components/elements/Sidebar";
import { NavBar } from "../components/elements/NavBar";
import CategoryService from "../services/CategoryService";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { useReactToPrint } from "react-to-print";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";

export default function DetailRiwayatProduk() {
  const { id } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [logProduct, setLogProduct] = useState([]);
  const [categories, setCategories] = useState([]);
  const componentRef = useRef();
  const navigate = useNavigate();

  const fetchDetailProduct = async () => {
    try {
      const response = await ProductService.getProductById(id);
      if (response._id) {
        setProduct(response);
      } else if (response.Produk) {
        setProduct(response.Produk);
      } else {
        throw new Error("Struktur response tidak dikenali");
      }
      console.log("Product data:", response);
    } catch (error) {
      console.error("Gagal mengambil produk:", error);
    }
  };

  const fetchLogProduct = async () => {
    try {
      const response = await InLogProdService.getAllLogProducts();

      const filteredLogs = response.LogProduk.filter(
        (log) => log.produk?._id === id
      );
      setLogProduct(filteredLogs);
      console.log("Response API Log Produk: ", filteredLogs);
    } catch (error) {
      console.error("Gagal mengambil log produk: ", error);
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
    const fetchData = async () => {
      await Promise.all([
        fetchDetailProduct(),
        fetchLogProduct(),
        fetchCategories(),
      ]);
    };
    fetchData();
  }, [id]);

  const typeBodyTemplate = (rowData) => {
    if (rowData === true) {
      return "Barang Masuk";
    } else {
      return "Barang Keluar";
    }
  };

  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current,
  //   pageStyle: `
  //     @page { size: auto; margin: 5mm; }
  //     @media print {
  //       body { -webkit-print-color-adjust: exact; }
  //       table { width: 100%; border-collapse: collapse; }
  //       th { background-color: #f0f0f0 !important; }
  //       th, td { border: 1px solid #000; padding: 8px; }
  //     }
  //   `,
  // });

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="flex bg-slate-200 px-3 py-4">
      <SidebarComponent />
      <div className="flex-1">
        <div className="ml-[210px] mt-[40px] p-4">
          <NavBar />

          <Button
            label="Kembali"
            icon="pi pi-angle-double-left"
            className="bg-sky-500 hover:bg-sky-600 mr-7 mb-3 text-white text-lg px-3 py-2"
            onClick={() => navigate(-1)}
          />

          {/* Konten Kategori Barang */}
          <div
            ref={componentRef}
            className="min-h-screen bg-white rounded-md shadow-lg border border-sky-200"
          >
            <h1 className="text-4xl text-sky-700 font-bold text-center pt-7">
              DETAIL RIWAYAT PRODUK
            </h1>

            {product && (
              <div className="space-y-2 text-black text-lg ml-28 mr-16 mt-5">
                <p>
                  <span className="font-medium">Kode Produk:</span>{" "}
                  {product.kode_produk}
                </p>
                <p>
                  <span className="font-medium">Nama Produk:</span>{" "}
                  {product.nama_produk}
                </p>
                <p>
                  <span className="font-medium">Kategori:</span>{" "}
                  {getCategoryName(product.kategori)}
                </p>

                <div className="card pr-10">
                  <DataTable
                    value={logProduct}
                    tableStyle={{ minWidth: "50rem", marginTop: "0.8rem" }}
                    showFooter
                    footerColumnGroup={
                      <ColumnGroup>
                        <Row>
                          <Column
                            footer="Total Jumlah Produk"
                            colSpan={3}
                            footerStyle={{
                              border: "1px solid #94a3b8",
                            }}
                            footerClassName="font-bold border border-slate-040"
                          />
                          <Column
                            footer={product?.stok || 0}
                            footerStyle={{
                              border: "1px solid #94a3b8",
                              textAlign: "center",
                            }}
                            footerClassName="font-bold"
                          />
                        </Row>
                      </ColumnGroup>
                    }
                  >
                    <Column
                      header="No."
                      body={(rowData, { rowIndex }) => rowIndex + 1}
                      style={{ width: "5%", textAlign: "center" }}
                      className="border border-slate-400 text-center"
                      headerClassName="border border-slate-400 bg-slate-200"
                    />
                    <Column
                      field="tanggal"
                      header="Tanggal"
                      body={(rowData) => formatDate(rowData.tanggal)}
                      style={{ width: "15%" }}
                      className="border border-slate-400"
                      headerClassName="border border-gray-400 bg-slate-200"
                    />
                    <Column
                      field="isProdukMasuk"
                      header="Jenis"
                      body={(rowData) =>
                        rowData.isProdukMasuk ? "Barang Masuk" : "Barang Keluar"
                      }
                      style={{ width: "15%" }}
                      className="border border-slate-400"
                      headerClassName="border border-slate-400 bg-slate-200"
                    />
                    <Column
                      field="stok"
                      header="Jumlah"
                      body={(rowData) => rowData.stok}
                      style={{ width: "10%" }}
                      className="border border-slate-400 text-center"
                      headerClassName="border border-gray-400 bg-slate-200"
                    />
                  </DataTable>
                </div>

                <div className="flex justify-center">
                  <Button
                    label="Cetak"
                    icon="pi pi-print"
                    // onClick={handlePrint}
                    className="bg-sky-600 text-white text-sm px-3 py-2 mt-12"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

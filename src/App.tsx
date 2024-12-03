import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import "./App.css";
import { DollarSign } from "lucide-react";
import { Button } from "./components/ui/button";
import { useEffect, useRef, useState } from "react";
import { supabase } from "./createClient";
import { log } from "console";

function App() {
  interface UserModel {
    floor_no: string;
    fname: string;
    house_no: string;
    id: string;
    phone_no: string;
  }
  interface BillModel {
    bid: string;
    created_at: string;
    status: string;
    transaction_no: string;
    uid: string;
    user_exchange: string;
  }
  interface CreateBill {
    price: number;
    bill_name: string;
  }
  interface SpecificUser {
    transaction_no: string;
    user_name: string;
    fname: string;
    lname: string;
    phone_no: string;
    floor_no: string;
    house_no: string;
    user_exchange: string;
  }
  interface BillSort {
    id: string;
    bill_name: string;
  }
  const dialogReference = useRef<HTMLDialogElement>(null);
  const [idForDeletion, setidForDeletion] = useState<string>();
  const [billsort, setbillsort] = useState<BillSort[]>([
    {
      bill_name: "",
      id: "",
    },
  ]);
  const [selects, setselects] = useState<string>("");
  const [createbill, setcreatebill] = useState<CreateBill>({
    bill_name: "",
    price: 0,
  });
  const [suser, setsuser] = useState<SpecificUser>({
    fname: "",
    house_no: "",
    lname: "",
    phone_no: "",
    user_name: "",
    transaction_no: "",
    floor_no: "",
    user_exchange: "",
  });
  const [uid, setuid] = useState<UserModel[]>([
    // user table
    {
      floor_no: "",
      fname: "",
      house_no: "",
      id: "",
      phone_no: "",
    },
  ]);
  const [bd, setbd] = useState<BillModel[]>([
    // bill_reference table
    {
      bid: "",
      created_at: "",
      status: "",
      transaction_no: "",
      uid: "",
      user_exchange: "",
    },
  ]);

  const createBill = async () => {
    const billCreate = await supabase.from("bill").insert(createbill);
    if (billCreate.error) console.log("Error: ", billCreate.error);
    if ((billCreate.status = 200)) {
      alert("Success");
    }
  };

  const fetchUserById = async (id: string) => {
    const userData = await supabase
      .from("user")
      .select("fname,lname,house_no,user_name,phone_no,floor_no")
      .eq("id", id);
      setidForDeletion(id);

    const billData = await supabase
      .from("bill_reference")
      .select("transaction_no,user_exchange")
      .eq("uid", id)
      .eq("bid", selects); // I have to compare between the transaction bid and the current bid
    if (billData) {
      dialogReference.current?.showModal();
    }
    console.log("Specific user: ", userData.data);
    if (userData.data && billData.data) {
      const { fname, lname, house_no, phone_no, user_name, floor_no } =
        userData.data[0];
      const { transaction_no, user_exchange } = billData.data[0];
      setsuser({
        transaction_no,
        fname,
        lname,
        house_no,
        phone_no,
        user_name,
        floor_no,
        user_exchange,
      });
    }
    console.log("Specific bill for a specific user: ", billData.data);
  };
  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await supabase
        .from("user")
        .select("id,fname,house_no,floor_no,phone_no");
      console.log("User Data: ", userData.data);
      if (userData.data) {
        setuid(userData.data);
      }
      const billData = await supabase
        .from("bill_reference")
        .select("*")
        .eq("bid", selects);
      if (billData.data) {
        setbd(billData.data);
        console.log("Bill Data: ", billData.data);
      }
    };
    const fetchBillData = async () => {
      const billDataforSelectOption = await supabase
        .from("bill")
        .select("id,bill_name");
      console.log("BillData for sort: ", billDataforSelectOption.data);
      if (billDataforSelectOption.data)
        setbillsort(billDataforSelectOption.data);
    };
    fetchUserData();
    fetchBillData();
  }, [selects]);

  return (
    <>
      <section>
        <nav className="flex flex-col justify-between items-center bg-white p-3">
          <h2 className="bg-white font-semibold text-2xl">YOSEF</h2>
          <div className="flex items-center bg-white  ">
            <input
              type="text"
              placeholder="Search"
              className="rounded-md p-3"
            />
          </div>
          <Dialog>
            <DialogTrigger>
              <Button className="mt-3">Add Bill</Button>
            </DialogTrigger>
            <DialogContent className=" h-80">
              <DialogHeader>
                <DialogTitle>Add Bill</DialogTitle>
                <DialogDescription className="flex flex-col">
                  <div className="flex flex-col">
                    <div
                      className="flex flex-col"
                      style={{ alignItems: "flex-start" }}
                    >
                      <span className="text-black font-medium text-[18px]">
                        Bill-Name
                      </span>
                      <input
                        type="text"
                        alt=""
                        className="border border-gray-400 w-72 rounded-sm mt-2"
                        onChange={(e) =>
                          setcreatebill((prevState) => ({
                            ...prevState,
                            bill_name: e.target.value,
                          }))
                        }
                      />
                    </div>{" "}
                    <div
                      className="flex flex-col"
                      style={{ alignItems: "flex-start" }}
                    >
                      <span className="text-black font-medium text-[18px] mt-2 ">
                        Bill-price
                      </span>
                      <input
                        type="text"
                        alt=""
                        className="border border-gray-400 mt-2 w-72 rounded-sm"
                        onChange={(e) =>
                          setcreatebill((prevState) => ({
                            ...prevState,
                            price: Number(e.target.value),
                          }))
                        }
                      />
                    </div>{" "}
                  </div>
                  <button
                    className="p-1 w-24 mt-10 ml-5 bg-black text-white rounded-md font-semibold p-2"
                    onClick={() => {
                      createBill();
                    }}
                  >
                    Create
                  </button>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </nav>
        <div className=" md:flex">
          <div className="bg-white h-20 w-[85%] mx-auto my-0 flex justify-between items-center rounded-lg  mt-3 md:w-[300px] h-32 text-2xl">
            <div className="flex flex-col bg-white ml-5">
              <span className="bg-white font-semibold text-3xl">5 </span>
              <span className="bg-white">Paid users</span>
            </div>

            <DollarSign className="bg-green-200 text-green-700 mr-5 w-10 h-10 rounded-full"></DollarSign>
          </div>
          <div className="bg-white h-20 w-[85%] mx-auto my-0 flex justify-between items-center rounded-lg  mt-3 md:w-[300px] h-32 text-2xl">
            <div className="flex flex-col bg-white ml-5">
              <span className="bg-white font-semibold text-3xl">2 </span>
              <span className="bg-white">Unpaid users</span>
            </div>

            <DollarSign className="bg-red-200 text-red-700 mr-5 w-10 h-10 rounded-full"></DollarSign>
          </div>
          <div className="bg-white h-20 w-[85%] mx-auto my-0 flex justify-between items-center rounded-lg  mt-3 md:w-[300px] h-32 text-2xl">
            <div className="flex flex-col bg-white ml-5">
              <span className="bg-white text-3xl font-semibold">2 </span>
              <span className="bg-white">Pending users</span>
            </div>

            <DollarSign className="bg-yellow-200 text-yellow-700 mr-5 w-10 h-10 rounded-full"></DollarSign>
          </div>
        </div>
        <div className="flex flex-wrap gap-5 w-[90%] mx-auto my-0 justify-center  mt-5 md:w-[85%] gap-10 p-1 "></div>
        <select
          className="float-right"
          onChange={(e) => setselects(e.target.value)}
        >
          {billsort.map((b) => {
            return <option value={b.id}>{b.bill_name}</option>;
          })}
        </select>
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>House No.</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {uid.map((u, i) => {
              return (
                <TableRow
                  key={i}
                  onClick={() => {
                    fetchUserById(u.id);
                  }}
                >
                  <TableCell>{u.fname}</TableCell>
                  <TableCell>{u.house_no}</TableCell>
                  <TableCell>{u.phone_no}</TableCell>
                  {bd.map((b) => {
                    if (b.uid == u.id) {
                      return (
                        <>
                          <TableCell className="font-bold  text-green-600 w-2 p-1">
                            {b.status}
                          </TableCell>
                        </>
                      );
                    }
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <dialog ref={dialogReference} className="w-[100%] h-[300px] p-2">
          <button
            onClick={() => dialogReference.current?.close()}
            className="float-right bg-red-500 w-5 h-5 rounded-full flex items-center justify-center text-white"
          >
            x
          </button>
          <div className="flex flex-col p-2">
            <span>First-name: {suser.fname}</span>

            <span>Last-name: {suser.lname}</span>

            <span>Floor-no: {suser.floor_no}</span>

            <span>House-no:{suser.house_no}</span>

            <span>Phone-no:{suser.phone_no}</span>

            <span>Exhange:{suser.user_exchange}</span>

            <span>Transaction:{suser.transaction_no}</span>

            <span>User-name: {suser.user_name}</span>
          </div>
          <Button className="mt-3 bg-green-600 hover:bg-green-700">Flag as paid</Button>
          <Button className="ml-3 bg-red-600 hover:bg-red-800 "  onClick={async() => {
            console.log("User Id for deletion: ",idForDeletion);
            console.log("Bill Id for deletion: ",selects)
            const response = await supabase.from('bill_reference').delete().eq('bid',selects).eq('uid',idForDeletion)
            console.log("Response: ",response.status);
            
          }}>Flag as unpaid</Button>
        </dialog>
      </section>
    </>
  );
}

export default App;

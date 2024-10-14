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
import { useEffect, useState } from "react";
import { supabase } from "./createClient";

function App() {
const [uid,setuid] = useState<string | null>('');
  useEffect(() => {
      const fetchUserData = async () => {
        const userData = await supabase.from('user').select('id');
        console.log("User Data: ",userData.data);
        const billData = await supabase.from('bill_reference').select('status').eq('uid',userData.data)
        if(billData.error)
        console.log("bill Error: ", billData.error);
        else if (billData.data)
        console.log("bill data: ", billData.data);
        
        
      }

      // const billData = async () => {
      //   const {data} = await supabase.from('bill_reference').select('status');
      //   console.log("Bill Data: ",data);
        
      // }

      fetchUserData()
      // billData();
  }, [])

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
              <Button className="mt-3">Create Bill</Button>
            </DialogTrigger>
            <DialogContent className=" h-80">
              <DialogHeader>
                <DialogTitle>Create Bill</DialogTitle>
                <DialogDescription className="flex flex-col">
                  <div className="flex flex-col">
                    <div className="flex flex-col" style={{alignItems:"flex-start"}}>
                      <span className="text-black font-medium text-[18px]">Bill-Name</span>
                      <input type="text" alt="" className="border border-gray-400 w-72 rounded-sm mt-2" />
                    </div>{" "}
                    <div className="flex flex-col" style={{alignItems:"flex-start"}}>
                      <span className="text-black font-medium text-[18px] mt-2 ">Bill-price</span>
                      <input type="text" alt="" className="border border-gray-400 mt-2 w-72 rounded-sm" />
                    </div>{" "}
                  </div>
                  <Button className="p-1 w-24 mt-10 ml-5 ">Create</Button>

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
          <select className="float-right">
            <option value="Mesk 2017">This month</option>
            <option value="Mesk 2017">Mesk 2017</option>
            <option value="Mesk 2017">Mesk 2017</option>
            <option value="Mesk 2017">Mesk 2017</option>
          </select>
        <Table>
  <TableCaption>A list of your recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">Name</TableHead>
      <TableHead>House No.</TableHead>
      <TableHead>Phone</TableHead>
      <TableHead className="text-right">Amount</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">Ashenafi M.</TableCell>
      <TableCell>1169/42</TableCell>
      <TableCell>0945321854</TableCell>
      <TableCell className="text-right">$250.00</TableCell>
      <TableCell>UNPAID</TableCell>
    </TableRow>
  </TableBody>
</Table>

      </section>
    </>
  );
}

export default App;

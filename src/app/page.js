'use client';
import {useQuery, useQueryClient} from "@tanstack/react-query";
import OrderTable from "@/components/OrderTable";
import RateChart from "@/components/RateChart";
import {fetchBtcRate} from "@/lib/api";
import {Dialog, DialogBackdrop, DialogPanel, DialogTitle} from "@headlessui/react";
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

import React, {useState} from "react";
import TradeForm from "@/components/TradeForm";


export default function Home() {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false)
    const { data, isPending, isError, isSuccess, error } = useQuery({
            queryKey: ['rateBtcRate'],
            queryFn: () => fetchBtcRate(),
            keepPreviousData: true
        }
    );

  return (
      <>
          <div className="p-4 flex flex-wrap justify-around items-center min-h-screen">
              <div className="overflow-x-auto">
              <div className="flex border-2 border-gray-500 flex-col justify-center gap-4 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                      <p className="text-lg font-bold text-gray-900">Orders Table</p>
                      <button
                          onClick={() => setOpen(true)}
                          className="bg-indigo-600 p-2 font-bold rounded-lg cursor-pointer text-white">Add order</button>
                  </div>
                  <OrderTable />
              </div>
              </div>

              {isPending && <div className="relative md:w-1/3 w-full h-64 bg-white border border-gray-200">
                  {/* Axe Y (vertical) */}
                  <div className="absolute left-0 bottom-0 h-full w-1 bg-gray-300"></div>
                  {/* Axe X (horizontal) */}
                  <div className="absolute left-0 bottom-0 w-full h-1 bg-gray-300"></div>
                  {/* Placeholder pour les données */}
                  <div className="absolute left-1 bottom-1 right-0 top-0 bg-gray-200 animate-pulse"></div>
              </div>}
              {isSuccess && <RateChart isPending={isPending} data={data} />}
              {isError && <p>Erreur dans le chargement du graphe</p>}
          </div>
          <Dialog open={open} onClose={setOpen} className="relative z-10">
              <DialogBackdrop
                  transition
                  className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
              />

              <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                  <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                      <DialogPanel
                          transition
                          className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                      >
                          <TradeForm balance={10000} setOpen={setOpen} />
                      </DialogPanel>
                  </div>
              </div>
          </Dialog>
      </>
  );
}

"use client";

import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { Fragment } from 'react';
import Gallery from '@/components/gallery'; // Import your Gallery component

import IconButton from '@/components/ui/icon-button';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  return (
    <Transition show={open} appear as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <div className="fixed inset-0 bg-black bg-opacity-50" />

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-2 sm:p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-full sm:max-w-3xl overflow-hidden rounded-lg text-left align-middle">
                <div className="relative flex flex-col w-full items-center bg-white p-3 shadow-2xl sm:p-6 md:p-8">
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                    <IconButton onClick={onClose} icon={<X size={15} />} />
                  </div>
                  <div className="flex w-full justify-center">
                    <Gallery images={[ /* Pass your images array here */ ]} /> {/* Your Gallery component with images */}
                  </div>
                  <div className="flex flex-col items-center justify-center w-full">
                    {children}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
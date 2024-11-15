// import { usePathname } from 'next/navigation';

// const useBreadcrumbs = () => {
//   const pathname = usePathname();
//   // const { pathname } = location;

//   const pathnames = pathname.split('/').filter((x) => x);

//   return pathnames.map((value, index) => {
//     const to = `/${pathnames.slice(0, index + 1).join('/')}`;

//     // Format the value to be more readable
//     const formattedValue = value.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

//     return { to, label: formattedValue };
//   });
// };

// export default useBreadcrumbs;


import { usePathname } from 'next/navigation';

const useBreadcrumbs = () => {
  const pathname = usePathname();
  const pathnames = pathname.split('/').filter((x) => x);

  return pathnames.map((value, index) => {
    const to = `/${pathnames.slice(0, index + 1).join('/')}`;

    // Decode URI component and format the value to be more readable
    let formattedValue = decodeURIComponent(value)
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());

    // Truncate to the first 30 characters if necessary
    if (formattedValue.length > 30) {
      formattedValue = `${formattedValue.slice(0, 30)}...`;
    }

    return { to, label: formattedValue };
  });
};

export default useBreadcrumbs;

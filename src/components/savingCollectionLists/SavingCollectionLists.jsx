import { useMemo } from 'react'
import ReactTable from '../utilities/tables/ReactTable'

export default function SavingCollectionLists() {
  const columns = useMemo(
    () => [
      { Header: '#', accessor: 'id', disable: true },
      { Header: 'First Name', accessor: 'firstName' },
      { Header: 'Last Name', accessor: 'lastName', show: false }
    ],
    []
  )

  const data = useMemo(
    () => [
      {
        id: 1,
        firstName: 'Dinah',
        lastName: 'Daelman'
      },
      {
        id: 2,
        firstName: 'Fallon',
        lastName: 'Dearle'
      },
      {
        id: 3,
        firstName: 'Rafaello',
        lastName: 'Matteoni'
      },
      {
        id: 4,
        firstName: 'Ruthie',
        lastName: 'Willmore'
      },
      {
        id: 5,
        firstName: 'Maurine',
        lastName: 'Angel'
      },
      {
        id: 6,
        firstName: 'Jon',
        lastName: 'Meller'
      },
      {
        id: 7,
        firstName: 'Cullan',
        lastName: 'Vacher'
      },
      {
        id: 8,
        firstName: 'Ileana',
        lastName: 'Wheldon'
      },
      {
        id: 9,
        firstName: 'Fanchon',
        lastName: 'Hryskiewicz'
      },
      {
        id: 10,
        firstName: 'Linnea',
        lastName: 'Fochs'
      },
      {
        id: 11,
        firstName: 'Vally',
        lastName: 'Maryott'
      },
      {
        id: 12,
        firstName: 'Quinta',
        lastName: 'Henningham'
      },
      {
        id: 13,
        firstName: 'Kristos',
        lastName: 'Wartnaby'
      },
      {
        id: 14,
        firstName: 'Martino',
        lastName: 'Funcheon'
      },
      {
        id: 15,
        firstName: 'Karry',
        lastName: 'Murison'
      },
      {
        id: 16,
        firstName: 'Pancho',
        lastName: 'Slayford'
      },
      {
        id: 17,
        firstName: 'Prisca',
        lastName: 'MacLise'
      },
      {
        id: 18,
        firstName: 'Corbett',
        lastName: 'Deevey'
      },
      {
        id: 19,
        firstName: 'Barrie',
        lastName: 'Nowaczyk'
      },
      {
        id: 20,
        firstName: 'Skyler',
        lastName: 'Walesby'
      },
      {
        id: 21,
        firstName: 'Carr',
        lastName: 'Nancekivell'
      },
      {
        id: 22,
        firstName: 'Cornelia',
        lastName: 'Floch'
      },
      {
        id: 23,
        firstName: 'Anson',
        lastName: 'Aldins'
      },
      {
        id: 24,
        firstName: 'Jaquelyn',
        lastName: 'Muldrew'
      },
      {
        id: 25,
        firstName: 'Tab',
        lastName: 'Kidston'
      },
      {
        id: 26,
        firstName: 'Rooney',
        lastName: 'Illingworth'
      },
      {
        id: 27,
        firstName: 'Sterling',
        lastName: 'De Brett'
      },
      {
        id: 28,
        firstName: 'Salim',
        lastName: 'Benettolo'
      },
      {
        id: 29,
        firstName: 'Efrem',
        lastName: 'Halbord'
      },
      {
        id: 30,
        firstName: 'Jess',
        lastName: 'Rushbrook'
      },
      {
        id: 31,
        firstName: 'Rance',
        lastName: 'Rimes'
      },
      {
        id: 32,
        firstName: 'Warner',
        lastName: 'Crampton'
      },
      {
        id: 33,
        firstName: 'Jermayne',
        lastName: 'Moverley'
      },
      {
        id: 34,
        firstName: 'Ashly',
        lastName: 'Regler'
      },
      {
        id: 35,
        firstName: 'Cece',
        lastName: 'Dennett'
      },
      {
        id: 36,
        firstName: 'Josie',
        lastName: 'Balassi'
      },
      {
        id: 37,
        firstName: 'Darnell',
        lastName: 'Besson'
      },
      {
        id: 38,
        firstName: 'Vasily',
        lastName: 'Matteini'
      },
      {
        id: 39,
        firstName: 'Olive',
        lastName: 'Wadeson'
      },
      {
        id: 40,
        firstName: 'Norton',
        lastName: 'Hattigan'
      },
      {
        id: 41,
        firstName: 'Jarad',
        lastName: 'Jasik'
      },
      {
        id: 42,
        firstName: 'Godfree',
        lastName: 'Mayhow'
      },
      {
        id: 43,
        firstName: 'Hyacinthe',
        lastName: 'Welldrake'
      },
      {
        id: 44,
        firstName: 'Salem',
        lastName: 'Knowlys'
      },
      {
        id: 45,
        firstName: 'Wallie',
        lastName: 'Willarton'
      },
      {
        id: 46,
        firstName: 'Dukie',
        lastName: 'Dennett'
      },
      {
        id: 47,
        firstName: 'Izzy',
        lastName: 'Enden'
      },
      {
        id: 48,
        firstName: 'Malvin',
        lastName: 'Balazot'
      },
      {
        id: 49,
        firstName: 'Deidre',
        lastName: 'Stratiff'
      },
      {
        id: 50,
        firstName: 'Coriss',
        lastName: 'Disdel'
      },
      {
        id: 51,
        firstName: 'Ludwig',
        lastName: 'Poxson'
      },
      {
        id: 52,
        firstName: 'Marris',
        lastName: 'Pelz'
      },
      {
        id: 53,
        firstName: 'Efren',
        lastName: 'Lurner'
      },
      {
        id: 54,
        firstName: 'Arlene',
        lastName: 'Gaven'
      },
      {
        id: 55,
        firstName: 'Aristotle',
        lastName: 'McIlveen'
      },
      {
        id: 56,
        firstName: 'Ninon',
        lastName: 'Finneran'
      },
      {
        id: 57,
        firstName: 'Kyla',
        lastName: 'Cowherd'
      },
      {
        id: 58,
        firstName: 'Shaine',
        lastName: 'Veld'
      },
      {
        id: 59,
        firstName: 'Boote',
        lastName: 'Shipway'
      },
      {
        id: 60,
        firstName: 'Isabelle',
        lastName: 'Lampitt'
      },
      {
        id: 61,
        firstName: 'Harriott',
        lastName: 'Rabidge'
      },
      {
        id: 62,
        firstName: 'Rosalinda',
        lastName: 'Hawkeridge'
      },
      {
        id: 63,
        firstName: 'Jourdain',
        lastName: 'Menico'
      },
      {
        id: 64,
        firstName: 'Lemar',
        lastName: 'Sillwood'
      },
      {
        id: 65,
        firstName: 'Elena',
        lastName: 'Perl'
      },
      {
        id: 66,
        firstName: 'Mirelle',
        lastName: 'Matussevich'
      },
      {
        id: 67,
        firstName: 'Kelby',
        lastName: 'Fallon'
      },
      {
        id: 68,
        firstName: 'Cosette',
        lastName: 'Sketch'
      },
      {
        id: 69,
        firstName: 'Eba',
        lastName: 'Rogan'
      },
      {
        id: 70,
        firstName: 'Cecilia',
        lastName: 'Hoffman'
      },
      {
        id: 71,
        firstName: 'Rey',
        lastName: 'Capsey'
      },
      {
        id: 72,
        firstName: 'Daisey',
        lastName: 'Noto'
      },
      {
        id: 73,
        firstName: 'Winfred',
        lastName: 'Megainey'
      },
      {
        id: 74,
        firstName: 'Sansone',
        lastName: 'Gidney'
      },
      {
        id: 75,
        firstName: 'Nevil',
        lastName: 'Le Brum'
      },
      {
        id: 76,
        firstName: 'Jud',
        lastName: 'Brownsill'
      },
      {
        id: 77,
        firstName: 'Mayne',
        lastName: 'Roft'
      },
      {
        id: 78,
        firstName: 'Maridel',
        lastName: "O'Devey"
      },
      {
        id: 79,
        firstName: 'Gallagher',
        lastName: 'Currall'
      },
      {
        id: 80,
        firstName: 'Tami',
        lastName: 'Zellner'
      },
      {
        id: 81,
        firstName: 'Vannie',
        lastName: 'Kopfen'
      },
      {
        id: 82,
        firstName: 'Ruthi',
        lastName: 'Cabral'
      },
      {
        id: 83,
        firstName: 'Dodie',
        lastName: 'Newton'
      },
      {
        id: 84,
        firstName: 'Jaime',
        lastName: 'MacLure'
      },
      {
        id: 85,
        firstName: 'Jaquenette',
        lastName: 'Frie'
      },
      {
        id: 86,
        firstName: 'Tab',
        lastName: 'Chue'
      },
      {
        id: 87,
        firstName: 'Nappie',
        lastName: 'Hackworthy'
      },
      {
        id: 88,
        firstName: 'Umberto',
        lastName: 'Halpine'
      },
      {
        id: 89,
        firstName: 'Chloette',
        lastName: 'Brealey'
      },
      {
        id: 90,
        firstName: 'Lindy',
        lastName: 'Pellitt'
      },
      {
        id: 91,
        firstName: 'Neville',
        lastName: 'Leggon'
      },
      {
        id: 92,
        firstName: 'Valle',
        lastName: 'Mingaud'
      },
      {
        id: 93,
        firstName: 'Maurise',
        lastName: 'Larmouth'
      },
      {
        id: 94,
        firstName: 'De',
        lastName: 'Attenborough'
      },
      {
        id: 95,
        firstName: 'Natalya',
        lastName: 'Loos'
      },
      {
        id: 96,
        firstName: 'Ester',
        lastName: 'Impy'
      },
      {
        id: 97,
        firstName: 'Lena',
        lastName: 'Hallan'
      },
      {
        id: 98,
        firstName: 'Alissa',
        lastName: 'Siflet'
      },
      {
        id: 99,
        firstName: 'Nonna',
        lastName: 'Pady'
      },
      {
        id: 100,
        firstName: 'Emmey',
        lastName: 'Hammonds'
      }
    ],
    []
  )

  return <ReactTable columns={columns} data={[]} />
}

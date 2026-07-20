import AccountBalanceOutlined from '@mui/icons-material/AccountBalanceOutlined'
import AccountBalanceWalletOutlined from '@mui/icons-material/AccountBalanceWalletOutlined'
import AccountTreeOutlined from '@mui/icons-material/AccountTreeOutlined'
import AdminPanelSettingsOutlined from '@mui/icons-material/AdminPanelSettingsOutlined'
import AnalyticsOutlined from '@mui/icons-material/AnalyticsOutlined'
import AssessmentOutlined from '@mui/icons-material/AssessmentOutlined'
import BadgeOutlined from '@mui/icons-material/BadgeOutlined'
import CategoryOutlined from '@mui/icons-material/CategoryOutlined'
import CloseRounded from '@mui/icons-material/CloseRounded'
import CurrencyExchangeOutlined from '@mui/icons-material/CurrencyExchangeOutlined'
import DeleteOutlineOutlined from '@mui/icons-material/DeleteOutlineOutlined'
import FactCheckOutlined from '@mui/icons-material/FactCheckOutlined'
import FolderSharedOutlined from '@mui/icons-material/FolderSharedOutlined'
import GridViewOutlined from '@mui/icons-material/GridViewOutlined'
import GroupsOutlined from '@mui/icons-material/GroupsOutlined'
import HowToRegOutlined from '@mui/icons-material/HowToRegOutlined'
import HubOutlined from '@mui/icons-material/HubOutlined'
import ListAltOutlined from '@mui/icons-material/ListAltOutlined'
import ManageSearchOutlined from '@mui/icons-material/ManageSearchOutlined'
import MapOutlined from '@mui/icons-material/MapOutlined'
import MoneyOffOutlined from '@mui/icons-material/MoneyOffOutlined'
import NorthEastOutlined from '@mui/icons-material/NorthEastOutlined'
import PaymentsOutlined from '@mui/icons-material/PaymentsOutlined'
import PendingActionsOutlined from '@mui/icons-material/PendingActionsOutlined'
import PersonAddAlt1Outlined from '@mui/icons-material/PersonAddAlt1Outlined'
import PriceCheckOutlined from '@mui/icons-material/PriceCheckOutlined'
import ReceiptLongOutlined from '@mui/icons-material/ReceiptLongOutlined'
import RestoreFromTrashOutlined from '@mui/icons-material/RestoreFromTrashOutlined'
import RuleOutlined from '@mui/icons-material/RuleOutlined'
import SavingsOutlined from '@mui/icons-material/SavingsOutlined'
import ScheduleOutlined from '@mui/icons-material/ScheduleOutlined'
import SettingsOutlined from '@mui/icons-material/SettingsOutlined'
import SouthWestOutlined from '@mui/icons-material/SouthWestOutlined'
import SwapHorizOutlined from '@mui/icons-material/SwapHorizOutlined'
import TrendingDownOutlined from '@mui/icons-material/TrendingDownOutlined'
import TrendingUpOutlined from '@mui/icons-material/TrendingUpOutlined'
import TuneOutlined from '@mui/icons-material/TuneOutlined'

const icons = {
  account: AccountBalanceOutlined,
  analytics: AnalyticsOutlined,
  approval: FactCheckOutlined,
  approvals: PendingActionsOutlined,
  audit: AssessmentOutlined,
  auditMeta: ManageSearchOutlined,
  category: CategoryOutlined,
  categoryConfig: TuneOutlined,
  center: HubOutlined,
  close: CloseRounded,
  delete: DeleteOutlineOutlined,
  expense: TrendingDownOutlined,
  field: MapOutlined,
  finance: AccountBalanceOutlined,
  grid: GridViewOutlined,
  income: TrendingUpOutlined,
  internalAudit: RuleOutlined,
  loan: AccountBalanceWalletOutlined,
  memberApproval: HowToRegOutlined,
  memberRegistration: PersonAddAlt1Outlined,
  pendingLoanCollection: PendingActionsOutlined,
  pendingSavingsCollection: ScheduleOutlined,
  recycleBin: RestoreFromTrashOutlined,
  registeredAccounts: FolderSharedOutlined,
  registeredMembers: GroupsOutlined,
  regularLoanCollection: PriceCheckOutlined,
  regularSavingsCollection: PaymentsOutlined,
  savings: SavingsOutlined,
  setup: AccountTreeOutlined,
  settings: SettingsOutlined,
  staff: BadgeOutlined,
  staffRoles: AdminPanelSettingsOutlined,
  team: GroupsOutlined,
  transaction: ReceiptLongOutlined,
  transfer: CurrencyExchangeOutlined,
  transferDown: SouthWestOutlined,
  transferHorizontal: SwapHorizOutlined,
  transferUp: NorthEastOutlined,
  withdrawal: MoneyOffOutlined,
  list: ListAltOutlined
}

export default function MobileServiceIcon({ name, size = 25 }) {
  const Icon = icons[name] || GridViewOutlined

  return <Icon aria-hidden="true" focusable="false" sx={{ fontSize: size }} />
}

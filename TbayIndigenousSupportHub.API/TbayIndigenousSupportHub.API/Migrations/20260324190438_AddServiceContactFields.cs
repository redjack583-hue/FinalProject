using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TbayIndigenousSupportHub.API.Migrations
{
    /// <inheritdoc />
    public partial class AddServiceContactFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ContactInfo",
                table: "Services",
                newName: "Website");

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Services",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Services",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "Services",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "Services");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Services");

            migrationBuilder.DropColumn(
                name: "Phone",
                table: "Services");

            migrationBuilder.RenameColumn(
                name: "Website",
                table: "Services",
                newName: "ContactInfo");
        }
    }
}
